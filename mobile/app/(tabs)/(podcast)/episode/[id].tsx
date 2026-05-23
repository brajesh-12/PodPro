import { View, Text, TouchableOpacity, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, EllipsisVertical, Play, RemoveFormatting, Search } from 'lucide-react-native';
import { Image } from 'expo-image';
import { useEffect, useState } from 'react';
import { formatDate, formatDuration } from '@/lib/utils';
import usePlayerStore from '@/store/usePlayerStore';
import useSubscriptionStore from '@/store/useSubscriptionStore';
import useModalStore from '@/store/useModalStore';
import Animated, { useAnimatedScrollHandler, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { Download, Save, Share } from '@/Icons-assets/Icon';
import usePlaylistStore from '@/store/usePlaylistStore';
import API from '@/services/api';
import useDownloadStore from '@/store/useDownloadStore';

const HEADER_HEIGHT = 48;

const EpisodeDetail = () => {
  const router = useRouter();
  const { id: episodeId } = useLocalSearchParams();
  // const { getEpisodeById, selectedEpisode, podcast } = usePodcastStore();
  const { selectedEpisode, setSelectedEpisode, followingPodcasts } = useSubscriptionStore();
  const { setActiveEpisode } = usePlayerStore()
  const { setTappedEpisode, setPodcastId, openGlobalModal } = useModalStore();
  const { SaveEpisodes, savePlaylist, fetchSavedEpisodes } = usePlaylistStore();
  const { downloadEpisodes, startDownload, removeDownload } = useDownloadStore();

  const [containerHeight, setContainerHeight] = useState(0);
  console.log("containerHeight:", containerHeight);

  const getPodcastId = (docId: any) => {
    const podcast = followingPodcasts.find((pod) => pod.podcastId === docId);
    if (podcast) {
      return podcast.id;
    }
    return null;
  };

  const podId = getPodcastId(selectedEpisode?.podcastId);

  useEffect(() => {
    const id = Array.isArray(episodeId) ? episodeId[0] : episodeId;
    if (id) {
      setSelectedEpisode(id);
    }
  }, [episodeId, setSelectedEpisode]);

  const handlePlay = () => {
    setActiveEpisode({
      id: episodeId,
      title: selectedEpisode?.title,
      audioUrl: selectedEpisode?.audioUrl,
      podcastId: selectedEpisode?.podcastId,
      image: selectedEpisode?.image,
      podcastTitle: selectedEpisode?.podcastTitle
    });
  };

  const isSaved = SaveEpisodes.some((ep) => selectedEpisode?.id === ep.id);
  const handleSave = async () => {
    if (isSaved) {
      await API.removeEpisode(savePlaylist?.id, selectedEpisode?.episodeId);
      fetchSavedEpisodes();
    } else {
      const body = {
        podcastId: podId,
        episodeId: selectedEpisode?.id,
        playlistId: savePlaylist?.id
      }
      await API.addEpisodeToPlaylist(body);
      fetchSavedEpisodes();
    };
  };

  const updateDownload = async () => {
    if (selectedEpisode?.id) {
      if (downloadEpisodes[selectedEpisode.id]) {
        await removeDownload(selectedEpisode.id, selectedEpisode.episodeId);
      } else {
        if (podId) {
          await startDownload(selectedEpisode, podId);
        }
      }
    };
  };

  const scrollY = useSharedValue(0);

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    }
  });

  const headerStyle = useAnimatedStyle(() => {
    const scrolled = scrollY.value >= containerHeight;

    return {
      backgroundColor: scrolled ? 'rgb(242, 242, 242)' : 'none',
      borderBottomWidth: scrolled ? 0.8 : 0,
      borderBottomColor: scrolled ? 'grey' : "none",
    }
  });

  const textStyle = useAnimatedStyle(() => {
    const isScrolled = scrollY.value >= containerHeight;

    return {
      opacity: isScrolled ? 1 : 0
    }
  });

  if (selectedEpisode) {
    return (
      <View>

        {/* Header */}
        <Animated.View
          style={[{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            height: 48,
            paddingLeft: 12,
            paddingRight: 8,
            position: "absolute",
            right: 0,
            left: 0,
            top: 0,
            zIndex: 15
          }, headerStyle]}
        >
          <TouchableOpacity
            onPress={() => router.back()}
            style={{
              alignItems: "center",
              justifyContent: "center",
              height: 36,
              width: 36,
              borderRadius: 72
            }}
          >
            <ArrowLeft size={24} strokeWidth={2} />
          </TouchableOpacity>

          <Animated.View
            style={textStyle}
          >
            <Text
              numberOfLines={1}
              ellipsizeMode='tail'
              style={{
                fontFamily: "SF Pro",
                fontWeight: "600",
                fontSize: 16,
                lineHeight: 24,
                color: "black",
                width: 297
              }}
            >
              {selectedEpisode?.title}
            </Text>
          </Animated.View>

          <TouchableOpacity
            onPress={() => router.navigate({
              pathname: '/search'
            })}
            style={{
              alignItems: "center",
              justifyContent: "center",
              height: 36,
              width: 36,
              borderRadius: 72
            }}
          >
            <Search size={24} strokeWidth={2} />
          </TouchableOpacity>
        </Animated.View>

        <Animated.ScrollView
          showsVerticalScrollIndicator={false}
          style={{
            paddingTop: HEADER_HEIGHT,
          }}
          bounces={false}
          onScroll={onScroll}
        >
          {/* top container */}
          <View
            onLayout={(event) => {
              const { height } = event.nativeEvent.layout;
              setContainerHeight(height);
            }}
            style={{
              borderBottomWidth: 0.6,
              borderBottomColor: "grey"
            }}
          >

            {/* Podcast Title */}
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                height: 20,
                marginBottom: 16
              }}
            >
              <Text
                style={{
                  fontFamily: "SF Pro",
                  fontSize: 14,
                  fontWeight: "400",
                  lineHeight: 16,
                }}
              >
                {selectedEpisode?.podcastTitle}
              </Text>
            </View>

            {/* Thumnail and duration */}
            <View
              style={{
                gap: 8,
                paddingTop: 8,
                paddingBottom: 12,
                alignItems: "center",
                justifyContent: "center"
              }}
            >

              <View
                style={{
                  height: 180,
                  width: 180,
                  backgroundColor: "grey",
                  borderRadius: 4
                }}
              >
                <Image
                  source={{ uri: selectedEpisode?.image }}
                  style={{
                    height: "100%",
                    width: "100%",
                    borderRadius: 4
                  }}
                />
              </View>

              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <Text
                  style={{
                    fontFamily: "SF Pro",
                    fontSize: 14,
                    fontWeight: "400",
                    lineHeight: 16,
                    textAlign: "center"
                  }}
                >
                  {formatDate(selectedEpisode?.publishDate)} &#8226; {formatDuration(selectedEpisode?.duration)}
                </Text>
              </View>

            </View>

            {/* Episode Title */}
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 16
              }}
            >
              <View
                style={{
                  flexDirection: "column",
                  alignItems: "center",
                  width: 288,
                }}
              >
                <Text
                  style={{
                    fontFamily: "SF Pro",
                    fontSize: 24,
                    fontWeight: "700",
                    lineHeight: 32,
                    width: 288,
                    textAlign: "center"
                  }}
                >
                  {selectedEpisode?.title}
                </Text>

              </View>
            </View>

            {/* CTAs buttons */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 12,
                gap: 12
              }}
            >

              <Pressable
                onPress={updateDownload}
                style={{
                  height: 44,
                  width: 44,
                  borderRadius: 88,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "rgb(217, 217, 217)"
                }}
              >
                {
                  downloadEpisodes[selectedEpisode.id] 
                  ? <RemoveFormatting size={22} strokeWidth={2}/>
                  : <Download size={22} strokeWidth={2} />
                }
              </Pressable>

              <Pressable
                onPress={handleSave}
                style={{
                  height: 44,
                  width: 44,
                  borderRadius: 88,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "rgb(217, 217, 217)"
                }}
              >
                <Save size={22} strokeWidth={2} fill={isSaved ? 'black' : 'none'} />
              </Pressable>

              <TouchableOpacity
                onPress={() => handlePlay()}
                style={{
                  height: 64,
                  width: 64,
                  borderRadius: 128,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "rgb(217, 217, 217)"
                }}
              >
                <Play size={22} strokeWidth={2} fill={"black"} />
              </TouchableOpacity>

              <Pressable
                style={{
                  height: 44,
                  width: 44,
                  borderRadius: 88,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "rgb(217, 217, 217)"
                }}
              >
                <Share size={22} strokeWidth={2} />
              </Pressable>

              <Pressable
                onPress={() => {
                  openGlobalModal('episode')
                  setTappedEpisode(selectedEpisode);
                  setPodcastId(podId);
                }}
                style={{
                  height: 44,
                  width: 44,
                  borderRadius: 88,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "rgb(217, 217, 217)"
                }}
              >
                <EllipsisVertical size={22} strokeWidth={2} />
              </Pressable>

            </View>
          </View>

          <View
            style={{
              paddingHorizontal: 20,
              paddingTop: 16
            }}
          >
            <Text
              style={{
                fontFamily: "SF Pro",
                fontSize: 14,
                fontWeight: "400",
                lineHeight: 20
              }}
            >
              {selectedEpisode?.description}
            </Text>
          </View>
        </Animated.ScrollView>

      </View>
    )
  }
};

export default EpisodeDetail;