import DownloadManager from '@/lib/DownloadManager';
import { create } from 'zustand';
import { SavedEpisode } from './useSubscriptionStore';
import API from '@/services/api';
import usePlaylistStore from './usePlaylistStore';

export type DownloadStatus = 'IDLE' | "QUEUED" | "DOWNLOADING" | "PAUSED" | "CANCELLING" | "COMPLETED" | "FAILED";

export interface DownloadTask {
  episodeId: string;
  status: DownloadStatus;
  progress: number;
};

interface DownloadState {
  downloadEpisodes: Record<string, any>;
  activeDownloads: Record<string, number>;
  tasks: Record<string, DownloadTask>

  hydrate: () => Promise<void>;
  saveToDatabase: (podcastId: any, episodeId: string) => Promise<void>;
  updateTaskState: (episodeId: string, status: DownloadStatus, progress?: number) => void; 
  startDownload: (episode: SavedEpisode, podcastId: number) => Promise<void>;
  getAudioSource: (episode: SavedEpisode) => string;
  getImageSource: (episode: SavedEpisode) => string;
  clearDownloads: () => void;
}

const useDownloadStore = create<DownloadState>(
  (set, get) => ({
    downloadEpisodes: {},
    activeDownloads: {},
    tasks: {},

    // Load episodes from the disk
    hydrate: async() => {
      const episodesOnDisk = await DownloadManager.loadDownloadedEpisodes();
      set({downloadEpisodes: episodesOnDisk});
    },

    updateTaskState: (episodeId, status, progress) => {
      set((state) => {
        const existingTask = state.tasks[episodeId] || {episodeId, status: "IDLE", progress: 0}

        if(status === "DOWNLOADING") {
          if(
            existingTask.status !== "QUEUED" &&
            existingTask.status !== 'PAUSED' && 
            existingTask.status !== 'DOWNLOADING'
          ) {
            return state;
          }
        }

        return {
          tasks: {
            ...state.tasks,
            [episodeId]: {
              ...existingTask,
              status,
              progress: progress !== undefined ? progress : existingTask.progress,
            }
          }
        };
      })
    },

    startDownload: async (episode, podcastId) => {
      // Prevent duplicate download
      if(get().downloadEpisodes[episode.id] || get().activeDownloads[episode.id] !== undefined) return;

      set((state) => ({
        activeDownloads: {...state.activeDownloads, [episode.id]: 0}
      }));

      const result = await DownloadManager.downloadEpisode(episode, (progress) => {
        set((state) => ({
          activeDownloads: { ...state.activeDownloads, [episode.id]: progress}
        }));
      });

      if(result) {
        set((state) => {
          const newActive = { ...state.activeDownloads };
          delete newActive[episode.id];

          return {
            activeDownloads: newActive,
            downloadEpisodes: { ...state.downloadEpisodes, [episode.id]: result }
          };
        });

        // as episode is downloaded successfully add it to database
        const { downloadPlaylist, fetchDPEpisodes } = usePlaylistStore.getState();

        const body = {
          podcastId: podcastId,
          episodeId: episode.id,
          playlistId: downloadPlaylist?.id
        }
        await API.addEpisodeToPlaylist(body);
        fetchDPEpisodes();

      } else {
        set((state) => {
          const newActive = { ...state.activeDownloads };
          delete newActive[episode.id];

          return { activeDownloads: newActive };
        })
      }
    },

    clearDownloads: () => {
      DownloadManager.clearAll();

      // set downloadEpisodes and activeDownloads to empty object
      set({
        downloadEpisodes: {}
      });
    },

    getAudioSource: (episode) => {
      const local = get().downloadEpisodes[episode.id];
      return local ? local.localAudioUri : episode.audioUrl;
    },

    getImageSource: (episode) => {
      const local = get().downloadEpisodes[episode.id];
      return local ? local.localImageUri : episode.image;
    },

    saveToDatabase: async(podcastId: any, episodeId: string) => {
      try {
        const playlistId = usePlaylistStore.getState().downloadPlaylist;

        const body = {
          playlistId: playlistId,
          podcastId: podcastId,
          episodeId: episodeId
        };

        await API.addEpisodeToPlaylist(body);
        await usePlaylistStore.getState().fetchDPEpisodes();

      } catch (error) {
        console.log("Error saving to database:", error);
      }
    }

  })
);

export default useDownloadStore;