import { create } from 'zustand';
import { Podcast } from './usePodcastStore';
import { SavedEpisode } from './useSubscriptionStore';
import { fetchEpisodes, fetchPodcast, fetchPodcasts } from '@/services/podcastAPI';

export interface Category {
  name: string,
  code: string,
  image: number,
  subGenres: Category[],
}

interface SearchStore {
  isSearching: boolean;
  searchedPodcast: Podcast | null;
  results: Podcast[];
  recent: Podcast[];
  searchQuery: string;
  episodes: SavedEpisode[];
  episodesToRender: SavedEpisode[];
  selectedEpisode: SavedEpisode | null;

  selectedCategory: Category | null;
  categoryTopEpisodes: SavedEpisode[];
  categoryTopPodcasts: Podcast[];
  categoryTitle: string;
  setCategoryTitle: (title: string) => void; 

  setSelectedEpisode: (episodeId: string) => void;
  setEpisodesToRender: (episodes: SavedEpisode[]) => void;
  setSelectedCategory: (category: Category) => void; 
  setSearchedPodcast: (podcast: Podcast) => void;
  setEpisodes: (feedUrl: string) => Promise<void>;
  fetchSearchedPodcast: (id: string) => Promise<void>;
  setSearching: () => void;
  resetSearch: () => void;
  setSearchQuery: (query: string) => void;
  setResults: (value: any) => void;
}

const useSearchStore = create<SearchStore>(
  (set, get) => ({
    isSearching: false,
    results: [],
    recent: [],
    searchedPodcast: null,
    episodes: [],
    episodesToRender: [],
    selectedEpisode: null,

    searchQuery: "",

    selectedCategory: null,
    categoryTopEpisodes: [],
    categoryTopPodcasts: [],
    categoryTitle: "",
    setCategoryTitle: (title) => {
      set({categoryTitle: title});
    },

    setEpisodesToRender: (episodes) => {
      set({episodesToRender: episodes})
    },

    setSelectedCategory: async (category) => {
      set({selectedCategory: category});

      const podcasts = await fetchPodcasts(category.code, 15);
      set({categoryTopPodcasts: podcasts});
    },

    setSearchedPodcast: (podcast) => {
      set({searchedPodcast: podcast});
    },

    setEpisodes: async (feedUrl) => {
      const data = await fetchEpisodes(feedUrl);
      set({episodes: data});
      set({episodesToRender: get().episodes.slice(0, 10)});
    },

    setSelectedEpisode: (episodeId) => {
      const episode = get().episodes.find((ep) => ep.id === episodeId);
      set({selectedEpisode: episode});
    },

    fetchSearchedPodcast: async (id) => {
      const podcast = await fetchPodcast(id);
      set({searchedPodcast: podcast});
    },

    setSearching: () => {
      set({isSearching: !get().isSearching});
    },

    setSearchQuery: (query) => {
      set({searchQuery: query})
    },

    setResults: (value) => {
      set({results: value});
    },

    resetSearch() {
      set({searchQuery: "", results: []});
    },
  })
);

export default useSearchStore;