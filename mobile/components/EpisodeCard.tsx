import { View, Text, Pressable } from 'react-native';
import { EllipsisVertical, Play } from 'lucide-react-native';
import useSubscriptionStore, { SavedEpisode } from '@/store/useSubscriptionStore';
import { formatDuration, formatDate } from '@/lib/utils';
import { Image } from 'expo-image';
import useModalStore from '@/store/useModalStore';
import { useRouter } from 'expo-router';
import usePlayerStore from '@/store/usePlayerStore';
import useDownloadStore from '@/store/useDownloadStore';
import API from '@/services/api';
import usePlaylistStore from '@/store/usePlaylistStore';
import { Downloaded, Save } from '@/Icons-assets/Icon';
import AnimatedDownloadIcon from './AnimatedDownloadIcon';
import DownloadEngine from '@/lib/DownloadEngine';
import { usePodcastStore } from '@/store/usePodcastStore';
import useSearchStore from '@/store/useSearchStore';

const EpisodeCard: React.FC<{ episode: SavedEpisode, tab: string }> = ({ episode, tab }) => {
  const router = useRouter();

  const { openModal, setTappedEpisode, setPodcastId } = useModalStore();
  const { podcast } = usePodcastStore();
  const { searchedPodcast } = useSearchStore();
  const { setActiveEpisode } = usePlayerStore();
  const { followingPodcasts } = useSubscriptionStore();
  const { SaveEpisodes, savePlaylist, addingEpisode, fetchSavedEpisodes } = usePlaylistStore();

  const task = useDownloadStore(state => state.tasks[episode.id]) || { status: 'IDLE', progress: 0 };
  const isHistoricallyDownladed = useDownloadStore(state => !!state.downloadEpisodes[episode.id]);

  const findPodcastId = () => {
    const podcast = followingPodcasts.find((pod) => pod.podcastId === episode.podcastId);
    if (podcast) {
      return podcast.id
    };
    return null;
  };
  const podId = findPodcastId();
  const isSaved = SaveEpisodes.some((ep) => episode.id === ep.id);
  const savedEpisode = SaveEpisodes.find((ep) => episode.id === ep.id);

  let podcastId;

  if (tab === 'Home') {
    podcastId = podcast?.id;
  } else if (tab === 'Search') {
    podcastId = searchedPodcast?.id;
  } else {
    podcastId = podId;
  }

  const handleSave = async () => {
    if (isSaved) {
      await API.removeEpisode(savePlaylist?.id, savedEpisode?.episodeId);
      fetchSavedEpisodes();
    }
    else {
      const body = {
        podcastId: podcastId,
        episodeId: episode.id,
        playlistId: savePlaylist?.id
      }
      await addingEpisode(body);
      fetchSavedEpisodes();
    }
  };

  const handleDownloadPress = () => {
    switch (task.status) {
      case 'IDLE':
      case 'FAILED':
        DownloadEngine.enqueue(episode, podcastId);
        break;
      case 'DOWNLOADING':
        // here we don't need to remove episode from database, as it has not been saved yet
        DownloadEngine.cancel(episode.id);
        break;
      case 'PAUSED':
        DownloadEngine.resume(episode.id);
        break;
      case 'QUEUED':
      case 'COMPLETED':
        // for this we need to remove episode from database
        DownloadEngine.cancel(episode.id);
        break;
    }

    if (isHistoricallyDownladed && task.status === 'IDLE') {
      DownloadEngine.cancel(episode.id);
    }
  };

  return (
    <Pressable
      onPress={() => {
        if (tab === 'Home') {
          router.navigate({
            pathname: "/(tabs)/(home)/episode/[id]",
            params: { id: `${episode.id}` }
          })
        } else if (tab === 'Search') {
          router.navigate({
            pathname: "/(tabs)/(search)/episode/[id]",
            params: { id: `${episode.id}` }
          })
        } else {
          router.navigate({
            pathname: "/(tabs)/(podcast)/episode/[id]",
            params: { id: `${episode.episodeId}` }
          })
        }
      }}
      key={episode.id}
      style={{
        paddingBottom: 8,
        paddingTop: 6,
        borderBottomWidth: 0.8,
        borderBottomColor: "rgba(255, 255, 255, 0.2)",
        marginBottom: 8,
        paddingLeft: 20,
      }}
    >

      {/* Top Section */}
      <View
        style={{
          marginBottom: 8
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            gap: 12,
            alignItems: 'center',
            // backgroundColor: "yellow",
            marginBottom: 8,
            paddingRight: 8
          }}
        >
          {/* Left side */}
          <View
            style={{
              flexDirection: "row",
              alignItems: 'center',
              flex: 1,
              // justifyContent: "center",
              gap: 12,
            }}
          >
            <View
              style={{
                height: 72,
                width: 72,
                borderRadius: 4,
                backgroundColor: 'grey'
              }}
            >
              <Image
                source={{ uri: episode.image }}
                style={{
                  height: "100%",
                  width: "100%",
                  borderRadius: 4
                }}
              />
            </View>

            <View
              style={{
                flex: 1,
                flexDirection: 'column',
                gap: 4,
                // backgroundColor: "blue"
              }}
            >
              <Text
                numberOfLines={2}
                ellipsizeMode='tail'
                style={{
                  fontFamily: "SF Pro",
                  fontSize: 16,
                  fontWeight: '600',
                  lineHeight: 24,
                  color: 'rgba(255, 255, 255, 0.9)'
                }}
              >
                {episode.title}
              </Text>

              <Text
                style={{
                  fontFamily: "SF Pro",
                  fontSize: 14,
                  fontWeight: '400',
                  lineHeight: 16,
                  color: 'rgba(255, 255, 255, 0.7)'
                }}
              >
                {episode.podcastTitle}
              </Text>
            </View>
          </View>

          {/* Right side */}
          <Pressable
            style={{
              height: 32,
              width: 32,
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 32,
              // backgroundColor: "red"
            }}
            onPress={() => {
              setTappedEpisode(episode);
              setPodcastId(podId);
              openModal("episode");
            }}
          >
            <EllipsisVertical size={20} strokeWidth={2} color={'rgb(255, 255, 255)'} />
          </Pressable>
        </View>

        {/* Description Section */}
        <Text
          numberOfLines={2}
          ellipsizeMode='tail'
          style={{
            width: 353,
            fontFamily: "SF Pro",
            fontSize: 14,
            lineHeight: 20,
            fontWeight: '400',
            color: 'rgba(255, 255, 255, 0.7)'
          }}
        >
          {episode.description}
        </Text>
      </View>

      {/* Bottom Section */}
      <View
        style={{
          flexDirection: 'row',
          height: 40,
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingRight: 12
          // backgroundColor: "yellow"
        }}
      >
        {/* Left Section */}
        <View>
          <Text
            style={{
              fontFamily: "SF Pro",
              fontSize: 14,
              fontWeight: '400',
              lineHeight: 20,
              color: 'rgb(255, 255, 255)'
            }}
          >
            {formatDate(episode.publishDate)} &#xB7; {formatDuration(episode.duration)}
          </Text>
        </View>

        <View
          style={{
            flex: 1,
            height: "100%",
            flexDirection: 'row',
            gap: 2,
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >

          <Pressable
            style={{
              height: 38,
              width: 32,
              justifyContent: "center",
              paddingLeft: 7,
              borderRadius: 32
            }}
            onPress={handleSave}
          >
            <Save size={22} fill={isSaved ? 'rgb(255, 255, 255)' : 'none'} color='rgb(255, 255, 255)' />
          </Pressable>

          <Pressable
            style={{
              height: 38,
              width: 32,
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 32,
            }}
            onPress={handleDownloadPress}
          >
            {task.status === 'COMPLETED' || isHistoricallyDownladed
              ? <Downloaded size={28} fill={'rgb(255, 255, 255)'} />
              : <AnimatedDownloadIcon episode={episode} />
            }
          </Pressable>

          <Pressable
            style={{
              height: 32,
              width: 32,
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 32,
              // backgroundColor: "rgb(217, 217, 217)"
            }}
            onPress={() => {
              setActiveEpisode(episode);
            }}
          >
            <Play size={22} fill={'rgb(255, 255, 255)'} color={'rgb(255, 255, 255)'} />
          </Pressable>

        </View>
      </View>
    </Pressable>
  );
};

export default EpisodeCard;