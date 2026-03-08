import mongoose from "mongoose";
import Podcast from "./Podcast.js";

const {ObjectId} = mongoose.Schema.Types;

const episodeSchema = mongoose.Schema({
  podcastId: {
    type: ObjectId,
    ref: Podcast,
    required: true
  },
  episodeId: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  publishDate: {
    type: Date,
    required: true,
    index: true
  },
  audioUrl: {
    type: String,
    required: true
  },
  duration: {
    type: String,
    required: true
  },
  episodeType: {
    type: String
  },
  image: {
    type: String,
    required: true
  },
  podcastTitle: {
    type: String,
    required: true
  }
}, {timestamps: true});

const Episode = mongoose.model("Episodes", episodeSchema);

export default Episode;