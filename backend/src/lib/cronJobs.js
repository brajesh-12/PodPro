import Episode from "../model/Episode.js";
import Podcast from "../model/Podcast.js";
import RefreshTokens from "../model/RefreshToken.js";
import Subscription from "../model/Subscription.js";
import { XMLParser } from 'fast-xml-parser';
import cron from 'node-cron';

const parserConfig = {
  ignoreAttributes: false,
  attributeNamePrefix: "",
  parseAttributeValue: true,
  allowBooleanAttributes: true,
}

const parser = new XMLParser(parserConfig);

export const syncSubscribedPodcasts = async () => {
  // we get unique podcastIds from the subscription
  // now fetch podcasts from these podcastIds from Podcast database
  // loop in podcasts array and fetch episodes and compares it with update method and set if not exists
  try {
    const activePodcastIds = await Subscription.distinct('podcast');
    if (activePodcastIds.length === 0) {
      console.log("No active subscription found. Skipping sync.");
      return;
    }

    const podcasts = await Podcast.find({ _id: { $in: activePodcastIds } });
    for (const podcast of podcasts) {
      try {
        const feedUrl = podcast.feedUrl;
        const response = await fetch(feedUrl);
        const responseText = await response.text();

        const jsonObj = parser.parse(responseText);
        if (!jsonObj.rss || !jsonObj.rss.channel) {
          console.error("RSS or channel node missing in feed");
          return [];
        }

        const channel = jsonObj.rss.channel;
        const episodes = Array.isArray(channel.item) ? channel.item : [channel.item];

        // this is operations array
        const operations = episodes.map((ep) => {
          const episodeId = ep.guid?.["#text"] || ep.guid;

          return {
            updateOne: {
              filter: { episodeId },
              update: {
                $set: {
                  title: ep.title,
                  description: ep.description?.replace(/<[^>]*>?/gm, '') || '',
                  publishDate: ep.pubDate,
                  audioUrl: ep.enclosure?.url || ep.enclosure?.['@_url'] || '',
                  duration: ep['itunes:duration'],
                  episodeType: ep['itunes:episodeType'],
                  image: ep['itunes:image']?.['href'] || channel['image']?.['url'],
                  podcastTitle: podcast.title,
                  podcastId: podcast._id
                }
              },
              upsert: true
            }
          }
        });

        const result = await Episode.bulkWrite(operations, {ordered: false});
        console.log(`[Sync] ${podcast.title}: ${result.upsertedCount} new episodes.`)

      } catch (error) {
        console.log(`[Sync error] failed for ${podcast.title}:`, error.message);
      }
    }
    console.log('[Cron] Podcast sync completed.');
  } catch (error) {
    console.error("Error syncing subscribedPodcasts:", error);
  }
}

export const tokenCleanUp = async () => {
  
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  try {
    const result = await RefreshTokens.deleteMany({createdAt: {$lt: thirtyDaysAgo} });
    console.log(`[CronJob] Deleted ${result.deletedCount} old refresh tokens`);

  } catch (error) {
    console.log("[Cron error] Cleanup Job failed", error);
  }
}

export const initCronJobs = () => {
  cron.schedule('0 */6 * * *', syncSubscribedPodcasts);
  cron.schedule('0 0 * * *', tokenCleanUp);

  console.log('...Cron Jobs Scheduled Successfully');
}