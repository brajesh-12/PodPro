import API, { Playlist } from "@/services/api";
import { create } from "zustand";
import { SavedEpisode } from "./useSubscriptionStore";

interface PlaylistStore {
  allPlaylists: Playlist[];
  addToPlaylists: Playlist[];
  selectedPlaylist: Playlist | null;
  playlistEpisodes: SavedEpisode[];
  downloadPlaylist: SavedEpisode[];
  savePlaylist: SavedEpisode[];
  isCreating: boolean;

  fetchPlaylists: () => Promise<void>;
  singlePlaylist: (id: any) => Promise<void>;
  fetchEpisodes: (id: any) => Promise<void>;
  setIsCreating: (value: boolean) => void;
  createAndAddEpisode: (data: any, episodeId: any, podcastId: number) => Promise<void>;
  addingEpisode: (body: any) => Promise<void>;
}

const usePlaylistStore = create<PlaylistStore>(
  (set) => ({
    allPlaylists: [],
    addToPlaylists: [],
    selectedPlaylist: null,
    playlistEpisodes: [],
    downloadPlaylist: [],
    savePlaylist: [],

    // modals visiblity
    isCreating: false,

    setIsCreating: (value) => set({isCreating: value}),

    fetchPlaylists: async () => {
      try {
        const response = await API.getPlaylists();
        set({ allPlaylists: response });

        const filterDownload = response.filter((item: any) => item.type !== "Download" );
        set({ addToPlaylists: filterDownload });

        // set downloadPlaylist
        const downloadEpisodes = response.filter((item: any) => item.type === "Download");
        set({ downloadPlaylist: downloadEpisodes });

        // set savePlaylist
        const saveEpisodes = response.filter((item: any) => item.type === "Save");
        set({ savePlaylist: saveEpisodes })
        
      } catch (error) {
        console.log("Error fetching playlists:", error);
      }
    },

    singlePlaylist: async (id: any) => {
      try {
        const playlist = await API.singlePlaylist(id);
        set({selectedPlaylist: playlist});

      } catch (error) {
        console.log("Error fetching playlist:", error);
      }
    },

    fetchEpisodes: async (id: any) => {
      try {
        const episodes = await API.playlistEpisodes(id);
        set({playlistEpisodes: episodes});

      } catch (error) {
        console.log("Error fetching playlist episodes:", error);
      }
    },

    addingEpisode: async (body) => {
      try {
        await API.addEpisodeToPlaylist(body);
      } catch (error) {
        console.log("Error adding episode:", error);
      }
    },

    createAndAddEpisode: async (data, episodeId, podcastId) => {
      try {
        const newPlaylist = await API.createPlaylist(data);
        const savedPlaylist = newPlaylist.playlist;
        console.log("New Playlist:", savedPlaylist);

        // now add episode to this playlist
        const body = {
          podcast: podcastId,
          episodeId,
          playlistId: savedPlaylist._id
        }
        const newEpisode = await API.addEpisodeToPlaylist(body);
        console.log("New Episode added:", newEpisode);

      } catch (error) {
        console.log("Error adding episode in new playlist:", error);
      }
    }

  })
);

export default usePlaylistStore;