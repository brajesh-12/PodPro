import DownloadManager from '@/lib/DownloadManager';
import { create } from 'zustand';
import { SavedEpisode } from './useSubscriptionStore';

interface DownloadState {
  downloadEpisodes: Record<string, any>;
  activeDownloads: Record<string, number>;

  hydrate: () => Promise<void>;
  startDownload: (episode: SavedEpisode) => Promise<void>;
  removeDownload: (episodeId: string) => void;
  getAudioSource: (episode: SavedEpisode) => string;
  getImageSource: (episode: SavedEpisode) => string;

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

    startDownload: async (episode) => {
      // Prevent duplicate download
      if(get().downloadEpisodes[episode.id] || get().activeDownloads[episode.id]) return;

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
        })

      } else {
        set((state) => {
          const newActive = { ...state.activeDownloads };
          delete newActive[episode.id];

          return { activeDownloads: newActive };
        })
      }
    },

    removeDownload: (episodeId) => {
      DownloadManager.deleteEpisode(episodeId);
      // update UI
      set((state) => {
        const newDownloads = { ...state.downloadEpisodes };
        delete newDownloads[episodeId];

        return { downloadEpisodes: newDownloads };
      });
    },

    clearAllOnLogout: () => {
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