import useDownloadStore from "@/store/useDownloadStore";
import usePlaylistStore from "@/store/usePlaylistStore";


const useSyncDownload = () => {
  const { startDownload, hydrate, downloadEpisodes, activeDownloads } = useDownloadStore();
  const { downloadPlaylist } = usePlaylistStore();

  // sync download episodes from the database download playlist
  const performSync = async () => {
    await hydrate();

    const missingEpisodes = downloadPlaylist.filter((episode) => {
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
      startDownload(episode);
    }
  };

  return { performSync };
}

export default useSyncDownload;