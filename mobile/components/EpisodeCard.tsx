import { View, Text, Pressable, Alert } from 'react-native';
import { CirclePlay, EllipsisVertical, RemoveFormatting } from 'lucide-react-native';
import useSubscriptionStore, { SavedEpisode } from '@/store/useSubscriptionStore';
import { formatDuration, formatDate } from '@/lib/utils';
import { Image } from 'expo-image';
import useModalStore from '@/store/useModalStore';
import { useRouter } from 'expo-router';
import usePlayerStore from '@/store/usePlayerStore';
import useDownloadStore from '@/store/useDownloadStore';
import API from '@/services/api';
import usePlaylistStore from '@/store/usePlaylistStore';
import { Download, Save } from '@/Icons-assets/Icon';

const EpisodeCard: React.FC<{ episode: SavedEpisode }> = ({ episode }) => {
  const router = useRouter();

  const { openGlobalModal, setTappedEpisode, setPodcastId } = useModalStore();
  const { setActiveEpisode } = usePlayerStore();
  const { followingPodcasts } = useSubscriptionStore();
  const { downloadPlaylist, SaveEpisodes, savePlaylist, addingEpisode, fetchSavedEpisodes } = usePlaylistStore();

  const { downloadEpisodes, startDownload, removeDownload } = useDownloadStore();

  const findPodcastId = () => {
    const podcast = followingPodcasts.find((pod) => pod.podcastId === episode.podcastId);
    if (podcast) {
      return podcast.id
    };

    return null;
  };
  const podId = findPodcastId();
  const isSaved = SaveEpisodes.some((ep) => episode.id === ep.id );

  const handleSave = async () => {
    if(isSaved) {
      await API.removeEpisode(savePlaylist?.id, episode.episodeId);
      fetchSavedEpisodes();
    }
    else {
      const body = {
        podcastId: podId,
        episodeId: episode.id,
        playlistId: savePlaylist?.id
      }
      await addingEpisode(body);
      fetchSavedEpisodes();
    }
  }

  const updateDownload = async () => {
    if (!downloadEpisodes[episode.id]) {
      // this is download condition
      if (!podId || !downloadPlaylist?.id) {
        Alert.alert("Error", "Download playlist or podcast not found");
        return;
      }

      await startDownload(episode, podId);

    } else {
      // this is remove from download condition
      removeDownload(episode.id, episode.episodeId);
    }
  };

  return (
    <Pressable
      onPress={() => {
        router.navigate({
          pathname: "/(tabs)/(podcast)/episode/[id]",
          params: { id: `${episode.episodeId}` }
        })
      }}
      key={episode.id}
      style={{
        paddingHorizontal: 20,
        paddingBottom: 12,
        paddingTop: 6,
        borderBottomWidth: 0.8,
        borderBottomColor: 'grey',
        marginBottom: 8
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
            alignItems: 'center'
          }}
        >
          {/* Left side */}
          <View
            style={{
              flexDirection: "row",
              alignItems: 'center',
              gap: 12,
              marginBottom: 8
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
                flexDirection: 'column',
                gap: 4,
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
                  width: 237
                }}
              >
                {episode.title}
              </Text>

              <Text
                style={{
                  fontFamily: "SF Pro",
                  fontSize: 14,
                  fontWeight: '400',
                  lineHeight: 16
                }}
              >
                {episode.podcastTitle}
              </Text>
            </View>
          </View>

          {/* Right side */}
          <Pressable
            onPress={() => {
              openGlobalModal("episode");
              setTappedEpisode(episode);
              setPodcastId(podId)
            }}
          >
            <EllipsisVertical size={20} strokeWidth={2} />
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
            fontWeight: '400'
          }}
        >
          {episode.description}
        </Text>
      </View>

      {/* Bottom Section */}
      <View
        style={{
          flexDirection: 'row',
          height: 32,
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        {/* Left Section */}
        <View>
          <Text
            style={{
              fontFamily: "SF Pro",
              fontSize: 14,
              fontWeight: '400',
              lineHeight: 20
            }}
          >
            {formatDate(episode.publishDate)} &#xB7; {formatDuration(episode.duration)}
          </Text>
        </View>

        <View
          style={{
            flexDirection: 'row',
            gap: 16
          }}
        >

          <Pressable
            onPress={handleSave}
          >
            <Save size={22} fill={isSaved ? 'black' : 'none'}/>
          </Pressable>

          <Pressable
            onPress={updateDownload}
          >
            {downloadEpisodes[episode.id]
              ? <RemoveFormatting size={22} />
              : <Download size={22} />
            }
          </Pressable>

          <Pressable
            onPress={() => {
              setActiveEpisode(episode);
            }}
          >
            <CirclePlay size={22} strokeWidth={2} />
          </Pressable>

        </View>
      </View>
    </Pressable>
  )
}

export default EpisodeCard;