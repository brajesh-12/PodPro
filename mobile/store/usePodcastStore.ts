import { create } from 'zustand';
import { fetchPodcasts, CATEGORIES, fetchPodcast, fetchEpisodes } from '@/services/podcastAPI';

export interface Podcast {
  id: number,
  title: string,
  artist: string,
  thumbnail: string,
  genres: [],
  feedUrl: string
}

export interface Episode {
  id: string,
  title: string,
  description: string,
  publishDate: string,
  audioUrl: string,
  duration: string,
  image: string
}

interface PodcastState {
  // data
  trending: Podcast[],
  history: Podcast[],
  comedy: Podcast[],
  health: Podcast[],
  science: Podcast[],
  education: Podcast[],
  news: Podcast[],

  // Episodes data
  episodes: Episode[],
  selectedEpisode: Episode | null,

  // singlePodcast
  podcast: Podcast | null,

  // states
  isLoading: boolean,

  // Actions
  fetchData: () => Promise<void>;
  fetchPod: (podcastId: string) => Promise<void>;
  fetchEpisodesData: (feedUrl: string) => Promise<void>;
  getEpisodeById: (episodeId: any) => void;
  setPodcast: (podcast: any) => void,
}

export const usePodcastStore = create<PodcastState>((set, get) => ({
  trending: [],
  history: [],
  comedy: [],
  health: [],
  science: [],
  education: [],
  news: [],
  podcast: null,
  episodes: [],
  selectedEpisode: null,

  isLoading: false,

  setPodcast: (podcast: any) => set({podcast: podcast}), 

  fetchData: async () => {
    try {
      set({isLoading: true});
      const trendingData = await fetchPodcasts(CATEGORIES.ALL, '12');
      const historyData = await fetchPodcasts(CATEGORIES.HISTORY, '5');
      const comedyData = await fetchPodcasts(CATEGORIES.COMEDY, '5');
      const scienceData = await fetchPodcasts(CATEGORIES.SCIENCE, '5');
      const educationData = await fetchPodcasts(CATEGORIES.EDUCATION, '5');

      set({ trending: trendingData });
      set({ history: historyData.sort(() => Math.random() - 0.5) });
      set({ comedy: comedyData.sort(() => Math.random() - 0.5) });
      set({science: scienceData});
      set({education: educationData});
    } catch (error) {
      console.error("Error fetching data", error);
    } finally {
      set({isLoading: false})
    }
  },

  fetchPod: async (podcastId) => {
    try {
      const podcastData = await fetchPodcast(podcastId);
      set({podcast: podcastData});

    } catch (error) {
      console.error("Error fetching podcast:", error);
    }
  },

  fetchEpisodesData: async (feedUrl) =>  {
    try {
      const episodesData = await fetchEpisodes(feedUrl);
      set({episodes: episodesData});

    } catch (error) {
      console.error("Error fetching episodes:", error);
    }
  },

  getEpisodeById(episodeId) {
    const episode =  get().episodes.find((ep) => ep.id === episodeId);
    set({selectedEpisode: episode});
  },

}));