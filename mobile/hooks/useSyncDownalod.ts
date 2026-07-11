import useDownloadStore from "@/store/useDownloadStore";
import usePlaylistStore from "@/store/usePlaylistStore";


const useSyncDownload = () => {
  const { removeDownload, hydrate, downloadEpisodes, activeDownloads } = useDownloadStore();
  const { DPEpisodes } = usePlaylistStore();

  // sync download episodes from the database download playlist
  const syncOfflineDelete = async () => {
    await hydrate();
  
    const missingEpisodes = DPEpisodes.filter((episode: any) => {
      const isDownloaded = !!downloadEpisodes[episode.id];
      const isCurrentlyDownloading = activeDownloads[episode.id] !== undefined;

      return !isDownloaded && !isCurrentlyDownloading
    });

    if(missingEpisodes.length === 0) {
      console.log("Sync Completed: All episodes are already offline");
      return;
    };

    console.log(`Sync: Found ${missingEpisodes.length} missing episodes. Starting background downloads...`);

    for(const episode of missingEpisodes) {
      await removeDownload(episode.id, episode.episodeId);
    }
  };

  return { syncOfflineDelete };
}

export default useSyncDownload;