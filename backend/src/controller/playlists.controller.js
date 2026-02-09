import Episode from "../model/Episode.js";
import Playlist from "../model/Playlist.js";
import PlaylistItem from "../model/PlaylistItem.js";
import Podcast from "../model/Podcast.js";
import { saveEpisodes } from "../lib/utils.js";

export const getPlaylists = async (req, res) => {
  try {
    const userId = req.user._id;
    // now we get playlist created by user from Playlist database
    const playlists = await Playlist.find({ userId: userId });

    if (!playlists) {
      return res.status(404).json({ message: "No playlists from user" });
    }

    res.status(200).json(playlists);

  } catch (error) {
    console.error("Error getting playlist:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const createPlaylist = async (req, res) => {
  try {
    const userId = req.user._id;
    const { title, description, image } = req.body;

    if (!title) {
      return res.status(401).json({ message: "Please set title" });
    }

    const newPlaylist = new Playlist({
      userId,
      title,
      description,
      image
    });

    await newPlaylist.save();

    res.status(201).json({
      message: "Playlist created successfully.",
      playlist: newPlaylist
    });

  } catch (error) {
    console.error("Error creating playlist:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const addEpisode = async (req, res) => {
  try {
    // get podcastid, episodeId and playlistId from body
    // check if podcast with this id exists in podcasts collection
    // if present then check the episode with this id in episodes and same it in playlistItem with playlistId
    // if not then add this podcast in database, then again get episode with this id in playlistItem, with playlistId

    const { podInfo, episodeId, playlistId } = req.body;

    if(!episodeId || !playlistId) {
      return res.status(404).json({message: "EpisodeId and PlaylistId are not found."});
    }

    const podInData = await Podcast.findOne({ id: podInfo.id });

    if (!podInData) {
      const newPodcast = new Podcast({
        id: podInfo.id,
        title: podInfo.title,
        artist: podInfo.artist,
        thumbnail: podInfo.thumbnail,
        genres: podInfo.genres,
        feedUrl: podInfo.feedUrl
      });

      const savedPodcast = await newPodcast.save();

      const episodes = await saveEpisodes(podInfo.feedUrl, savedPodcast._id);

      if (episodes && episodes.length > 0) {
        console.log("Episodes to insert:", episodes.length);

        try {
          await Episode.insertMany(episodes, { ordered: false });
        } catch (error) {
          console.error("Error inserting episodes:", error);
        }
      } else {
        console.log("No episodes to insert");
      }

      const saveToEpisode = await Episode.findOne({ episodeId: episodeId, podcastId: newPodcast._id });

      if (!saveToEpisode) {
        return res.status(404).json({ message: "Epsiode not found" });
      }

      const saveToPlaylist = new PlaylistItem({
        playlistId,
        episodeId: saveToEpisode._id
      });

      await saveToPlaylist.save();
      res.status(201).json({message: "Episode added successfully"});
    }

    const episode = await Episode.findOne({ episodeId: episodeId, podcastId: podInData._id });

    if (!episode) {
      return res.status(404).json({ message: "Episode doesn't found" });
    }

    const saveToEpisode = new PlaylistItem({
      playlistId,
      episodeId: episode._id
    });

    await saveToEpisode.save();

    res.status(201).json({
      message: "Episode added successfully."
    });

  } catch (error) {
    console.error("Error adding episode:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const deletePlaylist = async (req, res) => {
  try {
    const playlistId = req.query.id;

    // delete the playlist with this playlidId from database
    // delete all playlistItems which contain this playlistId with episodes
    await Promise.all([
      Playlist.deleteOne({ _id: playlistId }),
      PlaylistItem.deleteMany({ playlistId: playlistId })
    ]);

    res.status(200).json({ message: "Playlist deleted successfully." });

  } catch (error) {
    console.error("Error deleting playlist:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const updatePlaylist = async (req, res) => {
  try {
    const playlistId = req.query.id;
    const { title, image, description } = req.body;

    if (!playlistId) {
      return res.status(401).json({ message: "PlaylistId is not found" });
    }

    await Playlist.updateOne({ _id: playlistId }, { $set: { title: title, description: description } });

    res.status(200).json({message: "Playlist updated successfully"});
    // update this image setting and deleting later

  } catch (error) {
    console.error("Error updating playlist:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const removeEpisode = async (req, res) => {
  // get playlistId and episodeId from the query
  // remove the connection between playlist and episode from playlistItem
  try {
    const id = req.query.id;
    const eId = req.query.eId;

    if(!id || !eId) {
      return res.status(404).json({message: "Invalid IDs"});
    }

    await PlaylistItem.deleteOne({ playlistId: id, episodeId: eId });

    res.status(200).json({ message: "Episode removed successfully" });
  } catch (error) {
    console.error("Error removing episode:", error);
    res.status(500).json({message: "Internal server error"});
  }

}

export const playlistEpisodes = async (req, res) => {
  try {
    // get playlistId from query
    // use playlistId to get episodes from  playlistItems and sort them according to their addedAt date
    const playlistId = req.query.id;

    const episodes = await PlaylistItem.find({
      playlistId: playlistId})
      .select("episodeId")
      .populate("episodeId")
      .sort({addedAt: -1})
    
    if(!episodes) {
      return res.status(404).json({message: "Playlist is empty"});
    }

    res.status(200).json(episodes);

  } catch (error) {
    console.error("Error getting playlist episodes:", error);
    res.status(500).json({message: "Internal server error"});
  }
}

// Run this function with signup 
export const defaultPlaylists = async (userId) => {
  await Playlist.insertMany([
    { userId, title: 'Downloads', type: 'Download' },
    { userId, title: "Save", type: 'Save' }
  ]);
};