import mongoose from "mongoose";
import User from "./User.js";

const {ObjectId} = mongoose.Schema.Types;

const playlistSchema = mongoose.Schema({
  userId: {
    type: ObjectId,
    ref: User,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['custom', 'Download', 'Save'],
    default: 'custom'
  },
  image: {
    type: String,
    default: ""
  },
  description: {
    type: String,
    default: ""
  }
}, {timestamps: true});

const Playlist = mongoose.model("Playlists", playlistSchema);

export default Playlist;