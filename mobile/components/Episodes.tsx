import { View, Text, FlatList, TouchableOpacity, Pressable, Alert } from 'react-native'
import { usePodcastStore } from '@/store/usePodcastStore';
import { Image } from 'expo-image';
import { CirclePlay, EllipsisVertical, RemoveFormatting } from 'lucide-react-native';
import { formatDate, formatDuration } from '../lib/utils';
import { useRouter } from 'expo-router';
import useModalStore from '@/store/useModalStore';
import { useEffect } from 'react';
import usePlaylistStore from '@/store/usePlaylistStore';
import API from '@/services/api';
import { Save, Download } from '@/Icons-assets/Icon';
import useDownloadStore from '@/store/useDownloadStore';
import usePlayerStore from '@/store/usePlayerStore';
import { SavedEpisode } from '@/store/useSubscriptionStore';

const Episodes = ({episodes}: {episodes: SavedEpisode[]}) => {
  const router = useRouter();
  const { podcast, fetchEpisodesData } = usePodcastStore();
  const { openModal, setTappedEpisode, setPodcastId } = useModalStore();
  const { savePlaylist, SaveEpisodes, addingEpisode, fetchSavedEpisodes, downloadPlaylist, DPEpisodes } = usePlaylistStore();
  const { startDownload, removeDownload, downloadEpisodes } = useDownloadStore();
  const { setActiveEpisode } = usePlayerStore();

  let podcastId = 0;

  if(podcast) {
    podcastId = podcast.id;
  };

  useEffect(() => {
    if (podcast) {
      fetchEpisodesData(podcast.feedUrl)
    }
  }, [fetchEpisodesData, podcast]);

  return (
    <View>

      <FlatList
        scrollEnabled={false}
        data={episodes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const isSaved = SaveEpisodes.some((ep) => item.id === ep.id);

          const handleSave = async () => {
            if (isSaved) {
              const epInDB = SaveEpisodes.find((ep) => item.id === ep.id);
              await API.removeEpisode(savePlaylist?.id, epInDB?.episodeId);
              fetchSavedEpisodes();

            } else {
              const body = {
                podcastId: podcast?.id,
                episodeId: item.id,
                playlistId: savePlaylist?.id
              };

              await addingEpisode(body);
              fetchSavedEpisodes();
            }
          };

          const updateDownload = async () => {
            if (!downloadEpisodes[item.id]) {
              if (!podcast?.id || !downloadPlaylist?.id) {
                return Alert.alert("Error", "Download playlist or podcast not found.");
              }

              await startDownload(item, podcast.id);

            } else {
              const epInDB = DPEpisodes.find((ep) => item.id === ep.id);
              await removeDownload(item.id, epInDB?.episodeId);
            }
          };

          return (
            <TouchableOpacity
              onPress={() => router.navigate({
                pathname: "/(tabs)/(home)/episode/[id]",
                params: { id: `${item.id}` }
              })}
              style={{
                paddingHorizontal: 20,
                paddingVertical: 16,
                borderBottomWidth: 0.8,
                borderBottomColor: 'grey',
                gap: 12
              }}
            >
              {/* first container */}
              <View
                style={{
                  flexDirection: "column",
                  gap: 8
                }}
              >
                {/* title and image */}
                <View
                  style={{
                    flexDirection: "row",
                    gap: 12,
                    alignItems: "center"
                  }}
                >
                  <View
                    style={{
                      width: 64,
                      height: 64,
                      backgroundColor: "grey",
                      borderRadius: 4
                    }}
                  >
                    <Image
                      source={{ uri: item.image }}
                      style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: 4
                      }}
                      contentFit="cover"
                    />
                  </View>

                  <Text
                    numberOfLines={2}
                    ellipsizeMode='tail'
                    style={{
                      width: 237,
                      fontFamily: "SF Pro",
                      fontSize: 16,
                      fontWeight: "600",
                      lineHeight: 24
                    }}
                  >
                    {item.title}
                  </Text>

                  <Pressable
                    onPress={() => {
                      openModal('episode');
                      setPodcastId(podcastId);
                      setTappedEpisode(item);
                    }}
                  >
                    <EllipsisVertical size={20} strokeWidth={2} />
                  </Pressable>

                </View>

                <View>
                  <Text
                    numberOfLines={2}
                    ellipsizeMode='tail'
                    style={{
                      width: 353,
                      fontFamily: "SF Pro",
                      fontSize: 14,
                      lineHeight: 18,
                      fontWeight: "400"
                    }}
                  >
                    {item.description}
                  </Text>
                </View>
              </View>

              {/* second container */}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  height: 32
                }}
              >

                <View>
                  <Text
                    style={{
                      fontFamily: "SF Pro",
                      fontSize: 14,
                      fontWeight: "400",
                      lineHeight: 20
                    }}
                  >
                    {formatDate(item.publishDate)} &#xB7; {formatDuration(item.duration)}
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    gap: 16,
                    alignItems: "center"
                  }}
                >
                  <Pressable
                    onPress={handleSave}
                  >
                    <Save size={22} fill={isSaved ? 'black' : 'none'} />
                  </Pressable>

                  <Pressable
                    onPress={updateDownload}
                  >
                    {downloadEpisodes[item.id]
                      ? <RemoveFormatting size={22} />
                      : <Download size={22} />
                    }
                  </Pressable>
                  <Pressable
                    onPress={() => setActiveEpisode(item)}
                  >
                    <CirclePlay size={24} strokeWidth={2} />
                  </Pressable>

                </View>
              </View>
            </TouchableOpacity>
          )
        }}
      />
    </View>
  )
};

export default Episodes;