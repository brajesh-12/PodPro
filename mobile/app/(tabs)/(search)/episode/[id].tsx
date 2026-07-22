import { View, Text, TouchableOpacity, Pressable } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router';
import { EllipsisVertical, Play, ChevronLeft } from 'lucide-react-native';
import { Image } from 'expo-image';
import { useEffect, useState } from 'react';
import { formatDate, formatDuration } from '@/lib/utils';
import usePlayerStore from '@/store/usePlayerStore';
import useModalStore from '@/store/useModalStore';
import Animated, { useAnimatedScrollHandler, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { Downloaded, Save, Share } from '@/Icons-assets/Icon';
import usePlaylistStore from '@/store/usePlaylistStore';
import API from '@/services/api';
import useDownloadStore from '@/store/useDownloadStore';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useSearchStore from '@/store/useSearchStore';
import DownloadEngine from '@/lib/DownloadEngine';
import AnimatedDownloadIcon from '@/components/AnimatedDownloadIcon';

const HEADER_HEIGHT = 48;

const EpisodeDetail = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const episodeId = Array.isArray(id) ? id[0] : id;

  const { selectedEpisode, setSelectedEpisode, searchedPodcast } = useSearchStore();
  const { setActiveEpisode } = usePlayerStore()
  const { SaveEpisodes, fetchSavedEpisodes, savePlaylist } = usePlaylistStore();
  const { downloadEpisodes, tasks } = useDownloadStore();
  const { openModal, setTappedEpisode, setPodcastId } = useModalStore();
  const [containerHeight, setContainerHeight] = useState(0);

  const podcastId = searchedPodcast?.id ? searchedPodcast?.id : null;

  useEffect(() => {
    setSelectedEpisode(episodeId);
  }, [episodeId, setSelectedEpisode]);

  const scrollY = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    }
  });

  const backgroundStyle = useAnimatedStyle(() => {
    const scrolled = scrollY.value >= containerHeight;

    return {
      backgroundColor: scrolled ? 'rgb(242, 242, 242)' : 'none',
      borderBottomWidth: scrolled ? 0.8 : 0,
      borderBottomColor: scrolled ? "grey" : "none"
    };
  });

  const textStyle = useAnimatedStyle(() => {
    const scrolled = scrollY.value >= containerHeight;
    return {
      opacity: scrolled ? 1 : 0
    };
  });

  const insets = useSafeAreaInsets();

  if (selectedEpisode) {

    const handlePlay = () => {
      setActiveEpisode({
        id: episodeId,
        title: selectedEpisode?.title,
        audioUrl: selectedEpisode?.audioUrl,
        podcastId: podcastId,
        image: searchedPodcast?.thumbnail,
        podcastTitle: searchedPodcast?.title
      });
    };

    const isSaved = SaveEpisodes.some((ep) => selectedEpisode?.id === ep.id);
    const handleSave = async () => {
      if (isSaved) {
        const epInDB = SaveEpisodes.find((ep) => selectedEpisode?.id === ep.id);

        await API.removeEpisode(savePlaylist?.id, epInDB?.episodeId);
        fetchSavedEpisodes();
      } else {
        const body = {
          podcastId: searchedPodcast?.id,
          episodeId: selectedEpisode?.id,
          playlistId: savePlaylist?.id
        };
        await API.addEpisodeToPlaylist(body);

        fetchSavedEpisodes();
      }
    };

    const task = tasks[episodeId] || {status: 'IDLE', progress: 0};
    const isHistoricallyDownladed = !!downloadEpisodes[episodeId];

    const handleDownload = () => {
      switch(task.status) {
        case 'IDLE':
        case 'FAILED':
          DownloadEngine.enqueue(selectedEpisode, podcastId);
          break;

        case 'DOWNLOADING':
          DownloadEngine.cancel(selectedEpisode.id);
          break;
        case 'PAUSED':
          DownloadEngine.resume(selectedEpisode.id);
          break;
        
        case 'QUEUED':
        case 'COMPLETED':
          DownloadEngine.cancel(selectedEpisode.id);
          break;
      };

      if(isHistoricallyDownladed && task.status === 'IDLE') {
        DownloadEngine.cancel(selectedEpisode.id);
      };
    };

    return (
      <View
        style={{
          paddingTop: insets.top,
        }}
      >

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
            top: insets.top,
            right: 0,
            left: 0,
            zIndex: 20
          }, backgroundStyle]}
        >
          <TouchableOpacity
            onPress={() => {
              router.back();
            }}
            style={{
              height: 44,
              width: 44,
              justifyContent: "center",
              paddingLeft: 7,
              backgroundColor: "white",
              borderRadius: 100,
              shadowOpacity: 0.12,
              shadowColor: "rgb(0, 0, 0)",
              shadowOffset: {
                height: 2,
                width: 1,
              },
              shadowRadius: 8
            }}
          >
            <ChevronLeft size={26} />
          </TouchableOpacity>

          <Animated.View
            style={[
              {
                height: "100%",
                flex: 1,
                justifyContent: "center",
                paddingLeft: 12
              },
              textStyle
            ]}
          >
            <Text
              numberOfLines={1}
              ellipsizeMode='tail'
              style={{
                fontFamily: "SF Pro",
                fontWeight: "600",
                fontSize: 18,
                lineHeight: 28,
                color: "black",
                width: 297
              }}
            >
              {selectedEpisode?.title}
            </Text>
          </Animated.View>

        </Animated.View>

        <Animated.ScrollView
          style={{
            paddingTop: HEADER_HEIGHT
          }}
          onScroll={onScroll}
          bounces={false}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
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
                {searchedPodcast?.title}
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
                onPress={handleDownload}
                style={{
                  height: 44,
                  width: 44,
                  borderRadius: 88,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "rgb(217, 217, 217)"
                }}
              >
                {task.status === 'COMPLETED' || isHistoricallyDownladed
                  ? <Downloaded size={28}/>
                  : <AnimatedDownloadIcon episode={selectedEpisode} />
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
                  setPodcastId(podcastId);
                  setTappedEpisode(selectedEpisode);
                  openModal("episode");
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

          <View
            style={{
              height: 180,
              width: "100%"
            }}
          />
        </Animated.ScrollView>

      </View>
    );
  };
};

export default EpisodeDetail;