import { Directory, File, Paths } from 'expo-file-system';
import { createDownloadResumable, DownloadPauseState } from 'expo-file-system/legacy'
import { SavedEpisode } from '@/store/useSubscriptionStore';
import DownloadDatabase from './DownloadDatabase';

// download directory
const Download_Dir = new Directory(Paths.document, "podcasts");

const activeTasksRegistry: Record<string, any> = {};

const DownloadManager = {
  // Ensure download directory exists
  async init() {
    if(!Download_Dir.exists) {
      Download_Dir.create();
    }

    DownloadDatabase.init();
  },

  async downloadEpisode(
    episode: SavedEpisode,
    onProgress: (progress: number) => void,
    resumeData?: string | null
  ) {
    await this.init();

    const epidoseFolder = new Directory(Download_Dir, episode.id);

    if(epidoseFolder.exists && !resumeData) {
      epidoseFolder.delete();
    };

    // Now checks if this episode folder is already exists
    if(!epidoseFolder.exists) {
      epidoseFolder.create();
    };

    // file inside the folder
    const audioFile = new File(epidoseFolder, "audio.mp3");
    const imageFile = new File(epidoseFolder, "cover.jpg");
    const metaFile = new File(epidoseFolder, "metadata.json");

    try {
      // Download audio with progress
      const downloadResumable = createDownloadResumable(episode.audioUrl, audioFile.uri, {}, 
        (downloadProgress) => {
          if(downloadProgress.totalBytesExpectedToWrite > 0) {
            const progress = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;

            onProgress(progress * 0.9);
          }
        },
        resumeData ? JSON.parse(resumeData) : undefined
      );

      activeTasksRegistry[episode.id] = downloadResumable;

      await downloadResumable.downloadAsync();

      delete activeTasksRegistry[episode.id];

      // Download image
      onProgress(0.95);
      await File.downloadFileAsync(episode.image, imageFile);

      // Write Matadata JSON
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
      delete activeTasksRegistry[episode.id];
      return null;
    }
  },

  async pauseDownload(episodeId: string): Promise<string | null> {
    const task = activeTasksRegistry[episodeId];
    if(task) {
      try {
        const pauseState: DownloadPauseState = await task.pauseAsync();
        delete activeTasksRegistry[episodeId];

        return JSON.stringify(pauseState);
      } catch (error) {
        console.log("Error pausing download:", error);
        return null;
      }
    }
    return null;
  },

  // delete episode
  async deleteEpisode(episodeId: string) {
    const task = activeTasksRegistry[episodeId];
    if(task) {
      try {
        await task.cancelAsync();
      } catch (error) {
        console.log("Error deleting episode", error);
      }
      delete activeTasksRegistry[episodeId];
    }

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
};

export default DownloadManager;