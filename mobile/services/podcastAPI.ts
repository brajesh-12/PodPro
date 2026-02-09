import {XMLParser} from 'fast-xml-parser';

const parserConfig = {
  ignoreAttributes: false,
  attributeNamePrefix: "",
  parseAttributeValue: true,
  allowBooleanAttributes: true,
}

const parser = new XMLParser(parserConfig);

const BASE_API = "https://itunes.apple.com";


export const CATEGORIES = {
  ALL: 'all',
  TECHNOLOGY: '1318',
  BUSINESS: '1321',
  COMEDY: '1303',
  HEALTH: '1512',
  NEWS: '1489',
  SCIENCE: '1533',
  SPORTS: '1316',
  TRUE_CRIME: '1488',
  EDUCATION: '1304',
  HISTORY: '1487',
}

export const fetchPodcasts = async (query: string, limit: string) => {

  try {
    const response = await fetch(`${BASE_API}/us/rss/toppodcasts/limit=${limit}/genre=${query}/json`);

    const data = await response.json();
    const entries = data.feed.entry;

    return entries.map((item: any) => ({
      id: item.id.attributes['im:id'],
      podcastTitle: item['im:name'].label,
      artist: item['im:artist'].label,
      thumbnail: item['im:image'][2].label
    }));
  } catch (error) {
    console.error('Error Fetching data:', error);
  }

};

export const fetchPodcast = async (podcastId: string) => {
  try {
    console.log('Fetching podcast with ID:', podcastId);
    const response = await fetch(`${BASE_API}/lookup?id=${podcastId}&entity=podcast`);

    if(!response.ok) {
      throw new Error(`API error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    const result = data.results[0];

    const tranformedData = {
      id: result.collectionId,
      podcastTitle: result.collectionName,
      artist: result.artistName,
      thumbnail: result.artworkUrl600,
      feedUrl: result.feedUrl,
      genres: result.genres
    }

    console.log("Podcast Data:", tranformedData);

    return tranformedData || null;

  } catch (error) {
    console.error("Error fetching single podcast:", error);
  }
}

export const fetchEpisodes = async (feedUrl: string) => {
  try {
    if (!feedUrl) {
      throw new Error('Feed URL is empty');
    }

    const response = await fetch(feedUrl);
    const responseText = await response.text();

    const jsonObj = parser.parse(responseText);
    const channel = jsonObj.rss.channel;
    const items = Array.isArray(channel.item) ? channel.item : [channel.item];

    const allMappedEpisodes = items.map((ep: any) => ({
      id: ep.guid?.["#text"] || ep.guid,
      title: ep.title,
      description: ep.description?.replace(/<[^>]*>?/gm, '') || '',
      publishDate: ep.pubDate,
      audioUrl: ep.enclosure?.url || ep.enclosure?.['@_url'] || '',
      duration: ep['itunes:duration'],
      image: ep['itunes:image']?.['@_href'] || channel['itunes:image']?.['@_href'],
      episodeType: ep['itunes:episodeType']
    }));

    const trailers = allMappedEpisodes.filter((ep:any) => ep.episodeType === 'trailer');
    const mainEpisodes = allMappedEpisodes.filter((ep:any) => ep.episodeType !== 'trailer');

    const sortedEpisodes = [...trailers, ...mainEpisodes];

    return sortedEpisodes;
  } catch (error) {
    console.error("Error fetching episodes:", error);
  }
}