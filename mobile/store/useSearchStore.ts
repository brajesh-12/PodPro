import { create } from 'zustand';
import { Podcast } from './usePodcastStore';

interface SearchStore {
  isSearching: boolean;
  results: Podcast[];
  recent: Podcast[];
  searchQuery: string;

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
    searchQuery: "",

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