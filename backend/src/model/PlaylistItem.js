import mongoose from "mongoose";
import Episode from "./Episode.js";
import Playlist from "./Playlist.js";

const {ObjectId} = mongoose.Schema.Types;

const playlistItemSchema = mongoose.Schema({
  playlistId: {
    type: ObjectId,
    ref: Playlist,
    required: true
  },
  episodeId: {
    type: ObjectId,
    ref: Episode,
    required: true
  },
  order: {
    type: Number
  },
  addedAt: {
    type: Date,
    default: Date.now
  }
});

const PlaylistItem = mongoose.model("PlaylistItems", playlistItemSchema);

export default PlaylistItem;