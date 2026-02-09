import { XMLParser, XMLValidator } from 'fast-xml-parser';

const parserConfig = {
  ignoreAttributes: false,
  attributeNamePrefix: "",
  parseAttributeValue: true,
  allowBooleanAttributes: true,
}

const parser = new XMLParser(parserConfig);

export const saveEpisodes = async(feedUrl, podcastId) => {
  try {
    if(!feedUrl) {
      console.error("FeedUrl is not true.");
      return [];
    }

    const response = await fetch(feedUrl);
    const responseText = await response.text();
    const validation = XMLValidator.validate(responseText);

    if(!validation) {
      console.error("Invalid XML formate");
      return [];
    }

    const jsonObj = parser.parse(responseText);
    if(!jsonObj.rss || !jsonObj.rss.channel) {
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
      podcastId,
    }));

  } catch (error) {
    console.error("Error saving episodes:", error);
    return [];
  }
}