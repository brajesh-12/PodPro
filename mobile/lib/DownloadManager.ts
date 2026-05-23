import {Directory, File, Paths,} from 'expo-file-system';
import { SavedEpisode } from '@/store/useSubscriptionStore';

// download directory
const Download_Dir = new Directory(Paths.document, "podcasts");

const DownloadManager = {
  // Ensure download directory exists
  async init() {
    if(!Download_Dir.exists) {
      Download_Dir.create();
    }
  },

  async downloadEpisode(
    episode: SavedEpisode,
    onProgress: (progress: number) => void
  ) {
    await this.init();

    const epidoseFolder = new Directory(Download_Dir, episode.id);
    // Now checks if this episode folder is already exists
    if(!epidoseFolder.exists) {
      epidoseFolder.create();
    }

    console.log("audioUrl:", episode.audioUrl);
    console.log("coverImage:", episode.image);

    // file inside the folder
    const audioFile = new File(epidoseFolder, "audio.mp3");
    const imageFile = new File(epidoseFolder, "cover.jpg");
    const metaFile = new File(epidoseFolder, "metadata.json");

    try {
      // Download audio with progress
      onProgress(0.2);
      await File.downloadFileAsync(episode.audioUrl, audioFile);

      // Download image
      onProgress(0.5);
      await File.downloadFileAsync(episode.image, imageFile);

      // Write Matadata JSON
      onProgress(0.9);
      const localData = {
        ...episode,
        localAudioUri: audioFile.uri,
        localImageUri: imageFile.uri,
        downloadedAt: new Date().toISOString(),
      }

      metaFile.write(JSON.stringify(localData));
      
      onProgress(1.0);
      return localData;

    } catch (error) {
      console.log("Bundle Download Failed:", error);
      if(epidoseFolder.exists) {
        epidoseFolder.delete();
      }
      return null;
    }
  },

  // delete episode
  deleteEpisode(episodeId: string) {
    const epidoseFolder = new Directory(Download_Dir, episodeId);
    if(epidoseFolder.exists) {
      epidoseFolder.delete();
    }
  },

  // DELETE EVERYTHING (call on logout)
  clearAll() {
    if(Download_Dir.exists) {
      Download_Dir.delete();
    }

    this.init();
  },

  async loadDownloadedEpisodes() {
    this.init();

    try {
      const entries = Download_Dir.list();
      const episodes: Record<string, unknown> = {};

      for(const entry of entries) {
        if(entry instanceof Directory) {
          const metaFile = new File(entry, 'metadata.json');

          if(metaFile.exists) {
            
            const metaString = await metaFile.text();
            episodes[entry.name] = JSON.parse(metaString);
          }
        }
      }
      return episodes;

    } catch (error) {
      console.log("Failed to load offline episodes:", error);
      return {};
    }
  }
}

export default DownloadManager;