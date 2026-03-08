import { create } from 'zustand';
import { Podcast } from './usePodcastStore';

interface SearchStore {
  isSearching: boolean,
  results: Podcast[],
  recent: Podcast[],

  setSearching: () => void,
  setResults: (value: any) => void,
}

const useSearchStore = create<SearchStore>(
  (set, get) => ({
    isSearching: false,
    results: [],
    recent: [],

    setSearching: () => {
      set({isSearching: !get().isSearching});
    },

    setResults: (value) => {
      set({results: value});
    }
  })
);

export default useSearchStore;