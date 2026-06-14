import { create } from "zustand";
import API from "@/services/api";
import { Alert } from "react-native";

export interface FollowedPod {
  podcastId: string,
  id: number,
  title: string,
  artist: string,
  thumbnail: string,
  genres: [],
  feedUrl: string
}

export interface SavedEpisode {
  podcastId: string,
  episodeId: string,
  id: string,
  title: string,
  description: string,
  publishDate: string,
  audioUrl: string,
  duration: string,
  image: string,
  podcastTitle: string,
}

interface SubscriptionStore {
  followingPodcasts: FollowedPod[];
  feed: SavedEpisode[];
  subscriptionIds: Set<number>;
  currentPage: number;
  hasNextPage: boolean;
  selectedPodcast: FollowedPod | null;
  isSelected: boolean;
  selectedEpisode: SavedEpisode | null;

  setFollowingPodcasts: () => Promise<void>;
  fetchFeed: (pageNum: number) => Promise<void>;
  toggleSubscription: (id: any) => Promise<void>;
  setSubscriptionIds: (ids: any) => void;
  singlePodFeed: (pageNum: number) => Promise<void>;
  setSelectedPodcast: (podcast: FollowedPod) => void;
  setIsSelected: (value: boolean) => void;
  clearSubcriptionIds: (ids: any) => void;
  setSelectedEpisode: (episodeId: string) => void;
}

const useSubscriptionStore = create<SubscriptionStore>(
  (set, get) => ({
    followingPodcasts: [],
    feed: [],
    subscriptionIds: new Set(),
    selectedPodcast: null,
    // this isSelected controlled fetching of episodes based on podcast selection 
    isSelected: false,

    selectedEpisode: null,

    currentPage: 1,
    hasNextPage: false,

    setFollowingPodcasts: async () => {
      try {
        const podcasts = await API.followedPods();

        set({ followingPodcasts: podcasts });
      } catch (error) {
        console.log("Error fetching followed podcads:", error);
      }
    },

    fetchFeed: async (pageNum) => {
      try {
        const response = await API.followingFeed(pageNum);
        const episodes = response.episodes.map((ep: any) => ({
          podcastId: ep.podcastId,
          episodeId: ep._id,
          id: ep.episodeId,
          title: ep.title,
          description: ep.description,
          publishDate: ep.publishDate,
          audioUrl: ep.audioUrl,
          duration: ep.duration,
          image: ep.image,
          podcastTitle: ep.podcastTitle
        }));

        set((state) => {
          const updatedFeed = pageNum > 1 
            ? [...state.feed, ...episodes]
            : episodes;

          return {
            feed: updatedFeed,
            currentPage: response?.currentPage || 1,
            hasNextPage: response?.hasNextPage || false
          }
        });
        console.log("currentPage:",response?.currentPage);
      } catch (error) {
        console.log("Error fetching feed:", error);
      }
    },

    toggleSubscription: async (id) => {
      const isSubscribed = get().subscriptionIds.has(id);

      // update UI
      set((state) => {
        // getting a set
        const newIds = new Set(state.subscriptionIds);

        // if already subscribed then delete else add this in set
        if (isSubscribed) {
          newIds.delete(id);
        } else {
          newIds.add(id)
        }
        return { subscriptionIds: newIds }
      });

      // now save change in database
      try {
        if (isSubscribed) {
          await API.unFollow(id);

          // also fetch updated data for podcast screen
          get().setFollowingPodcasts();

        } else {
          await API.follow(id);

          get().setFollowingPodcasts();
        }

      } catch (error) {
        console.log("Error toggling subscription:", error);

        // here we undo the changes in UI and show alert to user
        set((state) => {
          const newIds = new Set(state.subscriptionIds);
          if (isSubscribed) {
            newIds.add(id);
          } else {
            newIds.delete(id);
          }

          return { subscriptionIds: newIds }
        });

        Alert.alert("Error", "Something went wrong");
      }
    },

    setSubscriptionIds: (ids) => {
      set({ subscriptionIds: new Set(ids) });
    },

    setSelectedPodcast: (podcast) => {
      set({selectedPodcast: podcast});
      set({isSelected: true});
    },

    singlePodFeed: async (pageNum) => {
      try {
        const podcast = get().selectedPodcast;
        const response = await API.singlePodFeed(podcast?.podcastId, pageNum);

        const episodes = response.episodes.map((ep: any) => ({
          podcastId: ep.podcastId,
          episodeId: ep._id,
          id: ep.episodeId,
          title: ep.title,
          description: ep.description,
          publishDate: ep.publishDate,
          audioUrl: ep.audioUrl,
          duration: ep.duration,
          image: ep.image,
          podcastTitle: ep.podcastTitle
        }));

        set((state) => {
          const updatedFeed = pageNum > 1 
          ? [...state.feed, ...episodes]
          : episodes;

          return {
            feed: updatedFeed,
            currentPage: response?.currentPage || 1,
            hasNextPage: response?.hasNextPage || false
          }
        });

        console.log("currentPage:", response?.currentPage);
      } catch (error) {
        console.log("Error fetching singlePodFeed:", error);
      }
    },

    setIsSelected: (value) => set({isSelected: value}),

    setSelectedEpisode: (episodeId) => {
      const episode = get().feed.find((item) => item.episodeId === episodeId);
      set({selectedEpisode: episode});
    },

    clearSubcriptionIds: () => set({ subscriptionIds: new Set() }),

  })
);

export default useSubscriptionStore;