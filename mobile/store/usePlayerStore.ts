import {create} from 'zustand';
import {persist, createJSONStorage} from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Episode {
  id: string,
  title: string,
  audioUrl: string,
  podcastId: string,
  image: string,
  podcastTitle: string
}

interface PlayerState {
  activeEpisode: Episode | null,
  minimized: boolean,
  isPlaying: boolean,
  progress: {position: number, duration: number},
  seekTarget: number | null,

  setActiveEpisode: (episode: any) => void,
  togglePlay: () => void,
  minimizedPlayer: (value: any) => void,
  setProgress: (progress: any) => void,
  seekTo: (time: any) => void,
  resetPlayer: () => void,
}

const usePlayerStore = create<PlayerState>()(
  persist(
    (set, get) => ({
      activeEpisode: null,
      minimized: true,
      isPlaying: false,
      progress: {position: 0, duration: 0},
      seekTarget: null,

      setActiveEpisode: (episode) => {
        set({activeEpisode: episode});
        set({minimized: false});
        set({isPlaying: true});
      },

      togglePlay: () => {
        set({isPlaying: !get().isPlaying});
      },

      minimizedPlayer: (value) => {
        set({minimized: value});
      },

      setProgress: (progress) => {
        set({progress});
        console.log(progress);
      },
      seekTo: (time) => set({seekTarget: time}),

      resetPlayer: () => {
        set({activeEpisode: null});
        set({isPlaying: false});
        set({progress: {position: 0, duration: 0}});
        set({seekTarget: null});
      }
    }),
    {
      name: 'player-storage',
      storage: createJSONStorage(() => AsyncStorage)
    }
  )
);

export default usePlayerStore;