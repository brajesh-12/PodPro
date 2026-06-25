import { XMLParser, XMLValidator } from 'fast-xml-parser';
import Episode from '../model/Episode.js';

const parserConfig = {
  ignoreAttributes: false,
  attributeNamePrefix: "",
  parseAttributeValue: true,
  allowBooleanAttributes: true,
}

const parser = new XMLParser(parserConfig);

export const saveEpisodes = async (podcast) => {
  try {
    const feedUrl = podcast.feedUrl;

    if (!feedUrl) {
      console.error("FeedUrl is not true.");
      return [];
    }

    const response = await fetch(feedUrl);
    const responseText = await response.text();
    const validation = XMLValidator.validate(responseText);

    if (!validation) {
      console.error("Invalid XML formate");
      return [];
    }

    const jsonObj = parser.parse(responseText);
    if (!jsonObj.rss || !jsonObj.rss.channel) {
      console.error("RSS or channel node missing in feed");
      return [];
    }

    const channel = jsonObj.rss.channel;
    const episodes = Array.isArray(channel.item) ? channel.item : [channel.item];

    return episodes.map((ep) => ({
      episodeId: ep.guid?.["#text"] || ep.guid,
      title: ep.title,
      description: ep.description?.replace(/<[^>]*>?/gm, '') || '',
      publishDate: ep.pubDate,
      audioUrl: ep.enclosure?.url || ep.enclosure?.['@_url'] || '',
      duration: ep['itunes:duration'],
      episodeType: ep['itunes:episodeType'],
      image: ep['itunes:image']?.['href'] || channel['image']?.['url'],
      podcastTitle: podcast.title,
      podcastId: podcast._id,
    }));

  } catch (error) {
    console.error("Error saving episodes:", error);
    return [];
  }
};

export const fetchPodcast = async (id) => {
  try {
    const response = await fetch(`https://itunes.apple.com/lookup?id=${id}&entity=podcast`);
    const jsonResponse = await response.json();
    const result = jsonResponse.results[0];
    console.log("fetch result:", result);

    if (!response.ok) {
      throw new Error(`API error: ${response.status} - ${response.statusText}`);
    }

    const transformData = {
      id: result.collectionId,
      title: result.collectionName,
      artist: result.artistName,
      thumbnail: result.artworkUrl600,
      feedUrl: result.feedUrl,
      genres: result.genres
    }

    return transformData || null;

  } catch (error) {
    console.error("Error fetching podcast from itunes:", error);
  }
};

export const syncEpisodes = async (podcast) => {
  const feedUrl = podcast.feedUrl;
  if(!feedUrl) {
    throw new Error("FeedUrl is not founc");
  }

  try {
    const response = await fetch(podcast.feedUrl);
    const responseText = await response.text();

    const jsonObj = parser.parse(responseText);
    if (!jsonObj.rss || !jsonObj.rss.channel) {
      console.error("RSS or channel node is missing in feed");
      throw new Error("RSS or channel node is missing in feed");
    }

    const channel = jsonObj.rss.channel;
    const episodes = Array.isArray(channel.item) ? channel.item : [channel.item];

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
              podcastId: podcast._id,
            }
          },
          upsert: true
        }
      }
    });

    const result = await Episode.bulkWrite(operations, { ordered: false });
    console.log(`[Sync] ${podcast.title}: ${result.upsertedCount} new episodes`);

  } catch (error) {
    console.error("Erros syncing episodes:", error);
    throw new Error(error);
  }
};

export const getPublicIdFromUrl = (url) => {
  if(!url || !url.includes('/upload/')) return null;
  const parts = url.split('upload');
  const pathWithoutVersion = part[1].replace(/^v\d+\//, '');
  return pathWithoutversion.replace(/\.[^/.]+$/, "");
};