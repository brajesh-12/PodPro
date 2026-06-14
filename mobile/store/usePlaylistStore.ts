import API, { Playlist } from "@/services/api";
import { create } from "zustand";
import { SavedEpisode } from "./useSubscriptionStore";

interface PlaylistStore {
  allPlaylists: Playlist[];
  addToPlaylists: Playlist[];
  selectedPlaylist: Playlist | null;
  playlistEpisodes: SavedEpisode[];
  downloadPlaylist: Playlist | null;
  savePlaylist: Playlist | null;
  DPEpisodes: SavedEpisode[];
  SaveEpisodes: SavedEpisode[];

  fetchPlaylists: () => Promise<void>;
  singlePlaylist: (id: any) => Promise<void>;
  fetchEpisodes: (id: any) => Promise<void>;
  addingEpisode: (body: any) => Promise<void>;
  fetchSavedEpisodes: () => Promise<void>;
  fetchDPEpisodes: () => Promise<void>;
}

const usePlaylistStore = create<PlaylistStore>(
  (set, get) => ({
    allPlaylists: [],
    addToPlaylists: [],
    selectedPlaylist: null,
    playlistEpisodes: [],
    downloadPlaylist: null,
    savePlaylist: null,
    SaveEpisodes: [],
    DPEpisodes: [],

    fetchPlaylists: async () => {
      try {
        const response = await API.getPlaylists();
        set({ allPlaylists: response });

        const filterDownload = response.filter((item: any) => item.type !== "Download" );
        set({ addToPlaylists: filterDownload });

        // set downloadPlaylist
        const download = response.filter((item: any) => item.type === "Download");
        console.log("DownloadPlaylist:", download[0]);
        set({ downloadPlaylist: download[0] });

        // set savePlaylist
        const save = response.filter((item: any) => item.type === "Save");
        set({ savePlaylist: save[0] });

        await get().fetchDPEpisodes();
        await get().fetchSavedEpisodes();
        
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

    fetchSavedEpisodes: async () => {
      const id = get().savePlaylist?.id;
      const response = await API.playlistEpisodes(id);
      set({SaveEpisodes: response});
    },

    fetchDPEpisodes: async () => {
      const id = get().downloadPlaylist?.id;
      const response = await API.playlistEpisodes(id);
      set({DPEpisodes: response});
    }

  })
);

export default usePlaylistStore;