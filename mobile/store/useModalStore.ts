import { create } from 'zustand';
import { Episode, Podcast } from './usePodcastStore';
import { Playlist } from '@/services/api';

interface ModalStore {
  isOpen: boolean;
  openGlobalModal: (type: string) => void;
  type: string;
  closeGlobalModal: () => void;

  isAddTo: boolean;
  setIsAddTo: (value: boolean) => void;

  tappedEpisode: Episode | null;
  tappedPodcast: Podcast | null;
  tappedPlaylist: Playlist | null;
  podcastId: number | null;

  setTappedEpisode: (episode: any | null) => void;
  setTappedPodcast: (podcast: any | null) => void;
  setTappedPlaylist: (playlist: any) => void;
  setPodcastId: (id: number | null) => void;
}

const useModalStore = create<ModalStore>(
  (set, ) => ({
    isOpen: false,
    type: "",
    isAddTo: false,
    tappedEpisode: null,
    tappedPodcast: null,
    tappedPlaylist: null,
    podcastId: null,

    openGlobalModal: (type) => {
      set({isOpen: true});
      set({type: type});
    },

    closeGlobalModal: () => {
      set({isOpen: false});
    },

    setIsAddTo: (value) => set({isAddTo: value}),

    setTappedEpisode(episode) {
      console.log("TappedEpisode:",episode);
      set({tappedEpisode: episode});
    },

    setTappedPodcast(podcast) {
      set({tappedPodcast: podcast});
    },

    setTappedPlaylist: (playlist) => {
      set({tappedPlaylist: playlist});
    },
    setPodcastId: (id) => set({podcastId: id})
  })
);

export default useModalStore;