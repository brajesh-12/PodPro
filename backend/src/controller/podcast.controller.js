import Podcast from "../model/Podcast.js";
import Subscription from "../model/Subscription.js";
import { saveEpisodes } from "../lib/utils.js";
import Episode from "../model/Episode.js";

export const savePodcast = async (req, res) => {
  try {
    // get values from request
    const { id, title, artist, thumbnail, genres, feedUrl } = req.body;
    const userId = req.user._id;

    if (!id || !title || !artist || !thumbnail || !feedUrl) {
      return res.status(401).json({ message: "Incomplete data" });
    }
    // check database for podcast
    let saveToPodcast = null;
    let saveToSubscription = null;
    const podcastDoc = await Podcast.findOne({ id: id });

    if (!podcastDoc) {
      const newPodcastDoc = new Podcast({
        id,
        title,
        artist,
        thumbnail,
        genres,
        feedUrl
      });

      saveToPodcast = await newPodcastDoc.save();

      const newSubscription = new Subscription({
        userId,
        podcast: saveToPodcast._id
      });

      saveToSubscription = await newSubscription.save();

      const episodes = await saveEpisodes(feedUrl, newPodcastDoc._id);

      if(episodes && episodes.length > 0) {
        console.log("Episodes to insert:", episodes.length);

        try {
          await Episode.insertMany(episodes, {ordered: false});
        } catch (error) {
          console.error("Error inserting episodes:", error);
        }
      } else {
        console.log("No episodes to insert");
      }

    } else {
      saveToPodcast = podcastDoc;
      const newSubscription = new Subscription({
        userId,
        podcast: saveToPodcast._id
      });

      saveToSubscription = await newSubscription.save();
    }

    res.status(201).json({
      subscriptionId: saveToSubscription._id,
      userId,
      podcast: saveToPodcast._id
    });

  } catch (error) {
    console.error("Error saving podcast:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const getPodcasts = async (req, res) => {
  try {
    const user = req.user;
    const userId = user._id;

    const subscribedPodcasts = await Subscription.find({userId: userId}).populate("podcast");

    res.status(200).json(subscribedPodcasts);

  } catch (error) {
    console.error("Error getting podcasts:", error);
    res.status(500).json({message: "Internal server error"});
  }
}

export const followingFeed = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const userId = req.user._id;

  try {
    // get all podcasts from the database and save them in array
    // then use $in to get all episodes from the database
    // implement pagination

    const subs = await Subscription.find({userId: userId}).select("podcast");
    const subscribedIDs = subs.map((s) => s.podcast);
    console.log(subscribedIDs);

    const [ episodes, totalCount ] = await Promise.all([
      Episode.find({podcastId: {$in: subscribedIDs}})
      .sort({publishDate: -1})
      .skip(skip)
      .limit(limit),

      Episode.countDocuments({podcastId: { $in: subscribedIDs }})
    ]);

    res.status(200).json({
      episodes,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
      totalEpisodes: totalCount,
      hasNextPage: skip + episodes.length < totalCount
    });

  } catch (error) {
    console.error("Error getting feed:", error);
    res.status(500).json({message: "Internal server error"});
  }
}

export const podEpisodes = async (req, res) => {
  const {podcastId} = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  try {
    // user send podcastId with query parameter
    // then user podcastId to fetch episodes from the database
    // then sort and implement pagination too 
    const [ episodes, totalCount ] = await Promise.all([
      Episode.find({podcastId: podcastId})
      .sort({publishDate: -1})
      .skip(skip)
      .limit(limit),

      Episode.countDocuments({podcastId: podcastId})
    ]);

    res.status(200).json({
      episodes,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
      totalEpisodes: totalCount,
      hasNextPage: skip + episodes.length < totalCount
    })

  } catch (error) {
    console.error("Error fetching podcast episodes:", error);
    res.status(500).json({message: "Internal server error"});
  }
}

export const unFollow = async (req, res) => {
  // url = podcasts/?id=podcastId
  // enpoint for handling unfollowing of podcast 
  // which includes removing of podcast from database and 
  // maybe not thing about logic for this
  const userId = req.user._id;
  const podcastId = req.query.id;
  try {
    if(!userId || !podcastId) {
      return res.status(401).json({message: "Insufficient data"});
    }

    await Subscription.deleteOne({userId: userId, podcast: podcastId});
    res.status(200).json({message: "Podcast unfollowed successfully"});
  } catch (error) {
    console.error("Error unfollowing podcast", error);
    res.status(500).json({message: "Internal server error"});
  }
}