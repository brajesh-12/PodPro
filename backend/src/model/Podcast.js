import mongoose from 'mongoose';

const podcastSchema = mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  artist: {
    type: String,
    required: true
  },
  thumbnail: {
    type: String,
    required: true
  },
  genres: {
    type: Array,
    required: true
  },
  feedUrl: {
    type: String,
    required: true
  }
});

const Podcast = mongoose.model("Podcasts", podcastSchema);

export default Podcast;