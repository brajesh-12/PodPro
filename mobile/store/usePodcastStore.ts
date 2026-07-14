import { create } from 'zustand';
import { fetchPodcasts, CATEGORIES, fetchPodcast, fetchEpisodes } from '@/services/podcastAPI';
import { SavedEpisode } from './useSubscriptionStore';

export interface Podcast {
  id: number,
  title: string,
  artist: string,
  thumbnail: string,
  genres: [],
  feedUrl: string
}

export interface PodcastsData {
  popular: Podcast[],
  history: Podcast[],
  education: Podcast[],
  news: Podcast[],
  science: Podcast[],
  comedy: Podcast[],
  health: Podcast[],
  technology: Podcast[],
  business: Podcast[],
  fiction: Podcast[],
  trueCrime: Podcast[],
};

export interface Episode {
  id: string,
  title: string,
  description: string,
  publishDate: string,
  audioUrl: string,
  duration: string,
  image: string,
  podcastTitle: string
};

interface PodcastState {
  // data
  podcastsData: PodcastsData;

  filterResult: Podcast[];
  categoryTitle: string;

  // Episodes data
  episodes: SavedEpisode[];
  episodesToRender: SavedEpisode[];
  selectedEpisode: SavedEpisode | null;

  // singlePodcast
  podcast: Podcast | null;

  // states
  isLoading: boolean;

  // Actions
  setCategoryTitle: (title: string) => void;
  setEpisodesToRender: (episodes: SavedEpisode[]) => void;
  fetchPod: (podcastId: string) => Promise<void>;
  fetchEpisodesData: (feedUrl: string) => Promise<void>;
  getEpisodeById: (episodeId: any) => void;
  setPodcast: (podcast: any) => void;
  fetchFilterResult: (category: string) => void;
  resetPodcast: () => void;
  fetchPodcastsData: () => Promise<void>;
  isLoadingEpisodes: boolean;
}

export const usePodcastStore = create<PodcastState>((set, get) => ({
  podcastsData: {
    popular: [],
    history: [],
    education: [],
    news: [],
    science: [],
    comedy: [],
    health: [],
    technology: [],
    business: [],
    fiction: [],
    trueCrime: [],
  },
  podcast: null,
  episodes: [],
  episodesToRender: [],
  selectedEpisode: null,
  categoryTitle: "",
  filterResult: [],

  isLoading: false,
  isLoadingEpisodes: false,

  setCategoryTitle: (title) => {
    set({categoryTitle: title});
  },

  setEpisodesToRender: (episodes) => {
    set({episodesToRender: episodes});
  },

  setPodcast: (podcast: any) => set({ podcast: podcast }),

  fetchPodcastsData: async () => {
    try {
      set({ isLoading: true });

      const settled = await Promise.allSettled([
        fetchPodcasts(CATEGORIES.ALL, 15),
        fetchPodcasts(CATEGORIES.BUSINESS, 15),
        fetchPodcasts(CATEGORIES.COMEDY, 15),
        fetchPodcasts(CATEGORIES.EDUCATION, 15),
        fetchPodcasts(CATEGORIES.FICTION, 15),
        fetchPodcasts(CATEGORIES.HEALTH, 15),
        fetchPodcasts(CATEGORIES.HISTORY, 15),
        fetchPodcasts(CATEGORIES.NEWS, 15),
        fetchPodcasts(CATEGORIES.SCIENCE, 15),
        fetchPodcasts(CATEGORIES.TECHNOLOGY, 15),
        fetchPodcasts(CATEGORIES.TRUE_CRIME, 15),
      ]);

      const [popular, business, comedy, education, fiction, health, history, news, science, technology, trueCrime] = settled.map((pod) => pod.status === 'fulfilled' ? pod.value as Podcast[] : []);

      set({
        podcastsData: {
          popular,
          business,
          comedy,
          education,
          fiction,
          health,
          history,
          science,
          technology,
          trueCrime,
          news
        }
      });

    } catch (error) {
      console.log("One fetch request failed:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  fetchPod: async (podcastId) => {
    try {
      const podcastData = await fetchPodcast(podcastId);
      set({ podcast: podcastData });

    } catch (error) {
      console.error("Error fetching podcast:", error);
    }
  },

  fetchEpisodesData: async (feedUrl) => {
    try {  
      const episodesData = await fetchEpisodes(feedUrl);
      set({ episodes: episodesData });
      set({episodesToRender: get().episodes.slice(0, 10)});

    } catch (error) {
      console.error("Error fetching episodes:", error);
    }
  },

  getEpisodeById(episodeId) {
    const episode = get().episodes.find((ep) => ep.id === episodeId);
    set({ selectedEpisode: episode });
  },

  fetchFilterResult: async (category) => {
    const response = await fetchPodcasts(category, 5);
    set({ filterResult: response });
  },

  resetPodcast: () => {
    set({ podcast: null });
    set({ episodes: [] });
  }

}));