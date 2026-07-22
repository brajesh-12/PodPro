import usePlaylistStore from "@/store/usePlaylistStore";
import DownloadDatabase from "./DownloadDatabase";
import DownloadManager from "./DownloadManager";
import useDownloadStore from "@/store/useDownloadStore";
import { SavedEpisode } from "@/store/useSubscriptionStore";
import API from "@/services/api";

const MAX_CONCURRENT_DOWNLOADS = 1 //how many episodes can download at once

const episodeCache: Record<string, { episode: SavedEpisode, podcastId: any }> = {};

const DownloadEngine = {
  async enqueue(episode: SavedEpisode, podcastId: any) {
    // Save to Hard Drive (SQLite)
    episodeCache[episode.id] = { episode, podcastId };

    DownloadDatabase.upsertTask(episode.id, "QUEUED", 0, null);
    useDownloadStore.getState().updateTaskState(episode.id, "QUEUED", 0);

    this.processQueue();
  },

  async processQueue() {
    const allTasks = DownloadDatabase.getAllTasks();
    const store = useDownloadStore.getState();

    allTasks.forEach((t) => {
      if (store.downloadEpisodes[t.episodeId]) {
        DownloadDatabase.deleteTask(t.episodeId);
      }
    });

    const cleanTasks = DownloadDatabase.getAllTasks();
    const activeCount = cleanTasks.filter(t => t.status === "DOWNLOADING").length;

    if (activeCount >= MAX_CONCURRENT_DOWNLOADS) return;

    const nextTask = cleanTasks.find(t => t.status === "QUEUED");
    if (!nextTask) return;

    this.startTask(nextTask);
  },

  async startTask(task: any) {
    DownloadDatabase.updateProgress(task.episodeId, task.progress, task.pauseData);
    useDownloadStore.getState().updateTaskState(task.episodeId, "DOWNLOADING", task.progress);
    const { DPEpisodes } = usePlaylistStore.getState();

    const cacheData = await this.getEpisodeMetadata(task.episodeId);
    if (!cacheData) return;

    const { episode, podcastId } = cacheData;
    let lastDbUpdateTime = Date.now();

    const result = await DownloadManager.downloadEpisode(
      episode,
      (progress) => {
        useDownloadStore.getState().updateTaskState(task.episodeId, 'DOWNLOADING', progress);

        const now = Date.now();
        if (now - lastDbUpdateTime > 2000) {
          DownloadDatabase.updateProgress(task.episodeId, progress, task.pauseData);
          lastDbUpdateTime = now;
        }
      },
      task.pauseData
    );

    const currentTaskState = useDownloadStore.getState().tasks[task.episodeId];
    if (currentTaskState.status === "IDLE" || currentTaskState.status === "CANCELLING") {
      return;
    }

    if (result) {
      DownloadDatabase.deleteTask(task.episodeId);
      useDownloadStore.getState().updateTaskState(task.episodeId, "COMPLETED", 1);
      console.log("Download Completed");

      useDownloadStore.setState((state) => ({
        downloadEpisodes: { ...state.downloadEpisodes, [task.episodeId]: result }
      }));

      const isAlreadyInDB = DPEpisodes.some((ep) => ep.id === task.episodeId);

      if (!isAlreadyInDB) {
        try {
          const { downloadPlaylist, fetchDPEpisodes } = usePlaylistStore.getState();

          if (downloadPlaylist?.id) {
            const body = {
              podcastId: podcastId,
              episodeId: episode.id,
              playlistId: downloadPlaylist.id
            };

            await API.addEpisodeToPlaylist(body);
            await fetchDPEpisodes();
          };
        } catch (error) {
          console.log("Failed to sync completed download to database playlist:", error);
        }
      } else {
        console.log("Sync download complete. Episode is already in the database.");
      }

    } else {
      DownloadDatabase.upsertTask(task.episodeId, "FAILED", task.progress, task.pauseData);
      useDownloadStore.getState().updateTaskState(task.episodeId, "FAILED", task.progress);
    }

    this.processQueue();
  },

  async pause(episodeId: string) {
    useDownloadStore.getState().updateTaskState(episodeId, 'PAUSED');

    const pauseData = await DownloadManager.pauseDownload(episodeId);

    const progress = useDownloadStore.getState().tasks[episodeId]?.progress || 0;
    DownloadDatabase.upsertTask(episodeId, 'PAUSED', progress, pauseData);

    this.processQueue();
  },

  async cancel(episodeId: string) {
    const { tasks } = useDownloadStore.getState();

    useDownloadStore.getState().updateTaskState(episodeId, 'CANCELLING');

    await DownloadManager.deleteEpisode(episodeId);
    DownloadDatabase.deleteTask(episodeId);

    useDownloadStore.getState().updateTaskState(episodeId, 'IDLE', 0);

    console.log("Download cancelled successfully.");

    if (tasks[episodeId].status !== "DOWNLOADING" && tasks[episodeId].status !== "QUEUED") {

      useDownloadStore.setState((state) => {
        const newDownloads = { ...state.downloadEpisodes };
        delete newDownloads[episodeId];

        return {
          downloadEpisodes: newDownloads,
        }
      });

      try {
        const { downloadPlaylist, fetchDPEpisodes, DPEpisodes } = usePlaylistStore.getState();

        const epInDB = DPEpisodes.find((ep) => episodeId === ep.id);

        if (downloadPlaylist?.id && epInDB) {
          await API.removeEpisode(downloadPlaylist.id, epInDB.episodeId);
          await fetchDPEpisodes();
        }

        console.log("Download removed from Database.");

      } catch (error) {
        console.log("Failed removing download from database:", error);
      }
    }

    delete episodeCache[episodeId];
    this.processQueue();
  },

  async getEpisodeMetadata(id: string) {
    return episodeCache[id] || null;
  },

  async resume(episodeId: string) {
    const task = DownloadDatabase.getAllTasks().find(t => t.episodeId === episodeId);
    DownloadDatabase.upsertTask(episodeId, "QUEUED", task?.progress, task?.pauseData);
    useDownloadStore.getState().updateTaskState(episodeId, "QUEUED", task?.progress);
    this.processQueue();
  },

  async syncDownloadWithDatabase() {
    const { downloadEpisodes, tasks } = useDownloadStore.getState();
    const { DPEpisodes, downloadPlaylist } = usePlaylistStore.getState();

    if (!downloadPlaylist?.id || !DPEpisodes) {
      console.log("No remote download playlist found to sync.");
      return;
    }

    const missingLocalEpisodes = DPEpisodes.filter((ep) => {
      const isDownloaded = !!downloadEpisodes[ep.id];
      const isCurrentlyDownloading = tasks[ep.id]?.status === "QUEUED" || tasks[ep.id]?.status === 'DOWNLOADING';

      return !isDownloaded && !isCurrentlyDownloading;
    });

    if (missingLocalEpisodes.length > 0) {
      console.log(`Found ${missingLocalEpisodes} missing episodes from cloud. Starting sync... `);

      missingLocalEpisodes.forEach(async (ep) => {
        const podcast = await API.getPodcastFromDocId(ep.podcastId);
        const podcastId = podcast.id;
        this.enqueue(ep, podcastId);
      });
    } else {
      console.log("Local downloads are perfectly synced with the database.");
    }
  }
};

export default DownloadEngine;