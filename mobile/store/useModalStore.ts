import { create } from 'zustand';
import { Podcast } from './usePodcastStore';
import { Playlist } from '@/services/api';
import { SavedEpisode } from './useSubscriptionStore';

interface ModalStore {
  isVisible: boolean;
  type: string;
  openModal: (type: string) => void;
  closeModal: () => void;
  openPlaylistSelection: () => void;
  closePlaylistSelection: () => void;

  // for creating saving episode in new playlist
  savingInNewPlaylist: boolean,
  saveToNewPlaylist: () => void,
  cancelSavingToNewPlaylist: () => void,

  playlistOpen: boolean;
  isAddTo: boolean;
  isCreating: boolean;

  // profile screen
  isDeleting: boolean;
  startDelete: () => void;
  stopDeleting: () => void;

  tappedEpisode: SavedEpisode | null;
  tappedPodcast: Podcast | null;
  tappedPlaylist: Playlist | null;
  podcastId: number | null;

  setTappedEpisode: (episode: any | null) => void;
  setTappedPodcast: (podcast: any | null) => void;
  setTappedPlaylist: (playlist: any) => void;
  setPodcastId: (id: number | null) => void;
  openPlaylistOptions: () => void;
  closePlaylistOptions: () => void;
  createPlaylist: () => void;
  cancelCreate: () => void;
}

const useModalStore = create<ModalStore>(
  (set, get ) => ({
    isOpen: false,
    isVisible: false,
    type: "",
    isAddTo: false,
    tappedEpisode: null,
    tappedPodcast: null,
    tappedPlaylist: null,
    podcastId: null,
    playlistOpen: false,
    isCreating: false,

    savingInNewPlaylist: false,
    saveToNewPlaylist() {
      set({savingInNewPlaylist: true});
    },
    cancelSavingToNewPlaylist() {
      set({savingInNewPlaylist: false})
    },

    createPlaylist() {
      set({isCreating: true})
    },

    cancelCreate() {
      set({isCreating: false})
    },

    openPlaylistOptions: () => {
      set({playlistOpen: true})
    },

    closePlaylistOptions: () => {
      set({playlistOpen: false})
    },

    openModal(type) {
      set({isVisible: true});
      set({type: type});
    },

    closeModal() {
      set({isVisible: false});
      set({type: ""});
    },

    openPlaylistSelection: () => {
      set({isAddTo: true});
    },

    closePlaylistSelection: () => {
      set({isAddTo: false});
    },

    setTappedEpisode(episode) {
      set({tappedEpisode: episode});
    },

    setTappedPodcast(podcast) {
      set({tappedPodcast: podcast});
    },

    setTappedPlaylist: (playlist) => {
      set({tappedPlaylist: playlist});
    },
    setPodcastId: (id) => set({podcastId: id}),

    isDeleting: false,
    startDelete: () => {
      set({isDeleting: true});
    },
    stopDeleting: () => {
      set({isDeleting: false});
    }
  })
);

export default useModalStore;