import mongoose from "mongoose";
import Podcast from "./Podcast.js";

const {ObjectId} = mongoose.Schema.Types;

const subscriptionSchema = mongoose.Schema({
  userId: {
    type: ObjectId,
    required: true
  },
  podcast: {
    type: ObjectId,
    ref: Podcast
  },
  subscribedAt: {
    type: Date,
    default: Date.now
  }
}, {timestamps: true});

const Subscription = mongoose.model("Subscription", subscriptionSchema);

export default Subscription;