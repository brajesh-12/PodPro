import DownloadManager from '@/lib/DownloadManager';
import { create } from 'zustand';
import { SavedEpisode } from './useSubscriptionStore';
import API from '@/services/api';
import usePlaylistStore from './usePlaylistStore';

interface DownloadState {
  downloadEpisodes: Record<string, any>;
  activeDownloads: Record<string, number>;

  hydrate: () => Promise<void>;
  startDownload: (episode: SavedEpisode, podcastId: number) => Promise<void>;
  removeDownload: (episodeId: string, eId: string | undefined) => Promise<void>;
  getAudioSource: (episode: SavedEpisode) => string;
  getImageSource: (episode: SavedEpisode) => string;
  clearDownloads: () => void;
}

const useDownloadStore = create<DownloadState>(
  (set, get) => ({
    downloadEpisodes: {},
    activeDownloads: {},

    // Load episodes from the disk
    hydrate: async() => {
      const episodesOnDisk = await DownloadManager.loadDownloadedEpisodes();
      set({downloadEpisodes: episodesOnDisk});
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

    removeDownload: async (episodeId, eId) => {
      DownloadManager.deleteEpisode(episodeId);
      // update UI
      set((state) => {
        const newDownloads = { ...state.downloadEpisodes };
        delete newDownloads[episodeId];

        const newActive = { ...state.activeDownloads };
        delete newActive[episodeId];

        return { 
          downloadEpisodes: newDownloads,
          activeDownloads: newActive
        };
      });

      // after removing it from storage update the database
      const { downloadPlaylist, fetchDPEpisodes } = usePlaylistStore.getState();

      await API.removeEpisode(downloadPlaylist?.id, eId);
      fetchDPEpisodes();
    },

    clearDownloads: () => {
      DownloadManager.clearAll();

      // set downloadEpisodes and activeDownloads to empty object
      set({
        activeDownloads: {},
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
    }

  })
);

export default useDownloadStore;