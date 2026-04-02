import authApi from '@/axios/interceptors';
import { Alert } from 'react-native';

// later we add one property for updateAt
export interface Playlist {
  id: string,
  title: string,
  description: string,
  image: string,
  createdAt: string,
  type: string
}

const API = {
  follow: async (id: number) => {
    // here we send request for following podcast
    try {
      const response = await authApi.post(`/podcasts`, {
        id: id
      });
      const message = response.data.message;
      console.log("Response:", message);

    } catch (error: any) {
      console.log(error.response.data?.message)
      if (error.response.status === 400) {
        Alert.alert("Error", error.response.data?.message);
      }
      else {
        Alert.alert("Error", "An unexpected system error occurred.");
      }
    }
  },

  unFollow: async (podcastId: any) => {
    // here we request backend for unfollow
    try {
      const response = await authApi.delete(`/podcasts?id=${podcastId}`);
      const data = response.data;
      console.log("Reponse:", data.message);

    } catch (error: any) {
      console.log(error.response.data?.message)
      if (error.response.status === 400) {
        Alert.alert("Error", error.response.data?.message);
      }
      else {
        Alert.alert("Error", "An unexpected system error occurred.");
      }
    }
  },

  podcast: async (id: number) => {
    try {
      const response = await authApi.get(`/podcasts/lookup?id=${id}`);
      const podcast = response.data;

      return podcast;

    } catch (error: any) {
      console.log("Error fetching podcast:", error.response.data?.message)
    }
  },

  followedPods: async () => {
    // here we get followed podcasts from the backend
    try {
      const response = await authApi.get('/podcasts');
      const data = response.data;

      return data.map((item: any) => ({
        podcastId: item.podcast._id,
        id: item.podcast.id,
        title: item.podcast.title,
        artist: item.podcast.artist,
        genres: item.podcast.genres,
        thumbnail: item.podcast.thumbnail,
        feedUrl: item.podcast.feedUrl
      }));
    } catch (error: any) {
      console.log(error.response?.data?.message);
      return [];
    }
  },

  followingFeed: async (page: number) => {
    // here we get following feed from the backend
    try {
      const response = await authApi.get(`/podcasts/episodes/feed?page=${page}&limit=8`);
      const feed = response.data;

      return feed;
    } catch (error: any) {
      console.log("Error fetching feed:", error.response?.data?.message);
    }
  },

  singlePodFeed: async (podcastId: any, page: any) => {
    // here we get episodes of one podcast
    try {
      const response = await authApi.get(`/podcasts/episodes/${podcastId}?page=${page}&limit=5`);
      const episodes = response.data;

      return episodes;

    } catch (error: any) {
      console.log("Error Fetching singlePodFeed:",error.response.data?.message);
      return [];
    }
  },

  createPlaylist: async (body: any) => {
    try {
      const response = await authApi.post('/playlists', {
        title: body.title,
        description: body.description || "",
        image: body.image || ""
      });

      const data = response.data;

      return data;

    } catch (error: any) {
      console.log("Error creating playlist:", error.response?.data?.message);
    }
  },

  getPlaylists: async () => {
    try {
      const response = await authApi.get("/playlists");

      const data = response.data;

      return data.map((playlist: any) => ({
        id: playlist._id,
        title: playlist.title,
        description: playlist.description,
        image: playlist.image,
        createdAt: playlist.createdAt,
        type: playlist.type
      }));
    } catch (error: any) {
      console.log("Error fetching playlists", error.response.data?.message)
    }
  },

  singlePlaylist: async (id: any) => {
    try {
      const response = await authApi.get(`/playlists/lookup?id=${id}`);
      const playlist = response.data;

      return {
        id: playlist._id,
        title: playlist.title,
        description: playlist.description,
        image: playlist.image,
        createdAt: playlist.createdAt,
        type: playlist.type
      };

    } catch (error: any) {
      console.log("Error fetching playlist:", error.response.data?.message);
      Alert.alert("Error", "Something went wrong.");
    }
  },

  deletePlaylist: async (playlistId: string) => {
    try {
      const response = await authApi.delete(`/playlists?id=${playlistId}`);

      const message = response.data?.message;
      console.log(message);

    } catch (error: any) {
      console.log("Error deleting playlist:", error.response.data?.message)
    }
  },

  playlistEpisodes: async (playlistId: any) => {
    try {
      const response = await authApi.get(`/playlists/episodes?id=${playlistId}`);

      const episodes = response.data;

      return episodes.map((ep: any) => ({
        podcastId: ep.episodeId.podcastId,
        episodeId: ep.episodeId._id,
        id: ep.episodeId.episodeId,
        title: ep.episodeId.title,
        description: ep.episodeId.description,
        publishDate: ep.episodeId.publishDate,
        audioUrl: ep.episodeId.audioUrl,
        duration: ep.episodeId.duration,
        image: ep.episodeId.image,
        podcastTitle: ep.episodeId.podcastTitle,
      }))

    } catch (error: any) {
      console.log("Error fetching playlist episodes:", error.response.data?.message);
      Alert.alert("Error", "Something went wrong");
    }
  },

  addEpisodeToPlaylist: async (body: any) => {
    if(!body.podcastId) return Alert.alert("PodcastId required");
    if(!body.episodeId) return Alert.alert("EpisodeId is required");
    if(!body.playlistId) return Alert.alert("PlaylistId is required");

    try {
      const response = await authApi.post(`/playlists/episodes`, {
        podcast: body.podcastId,
        episodeId: body.episodeId,
        playlistId: body.playlistId
      });

      const data = response.data;
      return data;
    } catch (error: any) {
      console.log("Error adding episode:", error.response.data?.message);
      Alert.alert("Error", error.response.data?.message);
    }
  },

  removeEpisode: async (id: any, eId: any) => {
    try {
      const response = await authApi.delete(`/playlists/episodes?id=${id}&eId=${eId}`);

      return response;

    } catch (error: any) {
      console.log("Error removing Episode:", error.response.data?.message);
    }
  }
}

export default API;