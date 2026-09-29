import { View, Text, TouchableOpacity, Pressable, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { EllipsisVertical, Play, ChevronLeft } from 'lucide-react-native';
import { Image } from 'expo-image';
import { useEffect, useState } from 'react';
import { usePodcastStore } from '@/store/usePodcastStore';
import { formatDate, formatDuration } from '@/lib/utils';
import usePlayerStore from '@/store/usePlayerStore';
import useModalStore from '@/store/useModalStore';
import Animated, { createAnimatedComponent, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { Downloaded, Save, Share2 } from '@/Icons-assets/Icon';
import usePlaylistStore from '@/store/usePlaylistStore';
import API from '@/services/api';
import useDownloadStore from '@/store/useDownloadStore';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import DownloadEngine from '@/lib/DownloadEngine';
import AnimatedDownloadIcon from '@/components/AnimatedDownloadIcon';
import { BlurView } from 'expo-blur';
import ButtonStyle from '@/constants/buttonStyles';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';

const HEADER_HEIGHT = 48;

const AnimatedMaskedView = createAnimatedComponent(MaskedView);

const EpisodeDetail = () => {
  const router = useRouter();

  const { id } = useLocalSearchParams();
  const episodeId = Array.isArray(id) ? id[0] : id;

  const { getEpisodeById, selectedEpisode, podcast } = usePodcastStore();
  const { setActiveEpisode } = usePlayerStore()
  const { SaveEpisodes, fetchSavedEpisodes, savePlaylist } = usePlaylistStore();
  const { downloadEpisodes, tasks } = useDownloadStore();
  const { openModal, setTappedEpisode, setPodcastId } = useModalStore();
  const [containerHeight, setContainerHeight] = useState(0);

  const podcastId = podcast?.id ? podcast?.id : null;

  const scrollY = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    }
  });

  const textStyle = useAnimatedStyle(() => {
    const scrolled = scrollY.value >= containerHeight;
    return {
      opacity: scrolled ? 1 : 0
    };
  });

  const blurLayoutOpacity = useAnimatedStyle(() => {
    const opacity = scrollY.value >= containerHeight - 60 ? 1 : 0
    return { opacity }
  });

  const insets = useSafeAreaInsets();

  useEffect(() => {
    getEpisodeById(episodeId);
  }, [episodeId, getEpisodeById]);

  if (selectedEpisode) {

    const handlePlay = () => {
      setActiveEpisode({
        id: episodeId,
        title: selectedEpisode.title,
        audioUrl: selectedEpisode.audioUrl,
        podcastId: podcast?.id,
        image: podcast?.thumbnail,
        podcastTitle: podcast?.title
      });
    };

    const isSaved = SaveEpisodes.some((ep) => selectedEpisode.id === ep.id);
    const handleSave = async () => {
      if (isSaved) {
        const epInDB = SaveEpisodes.find((ep) => selectedEpisode.id === ep.id);

        await API.removeEpisode(savePlaylist?.id, epInDB?.episodeId);
        fetchSavedEpisodes();
      } else {
        const body = {
          podcastId: podcast?.id,
          episodeId: selectedEpisode.id,
          playlistId: savePlaylist?.id
        };
        await API.addEpisodeToPlaylist(body);

        fetchSavedEpisodes();
      }
    };

    const task = tasks[episodeId] || { status: "IDLE", progress: 0 };

    const isHistoricallyDownladed = !!downloadEpisodes[episodeId];

    const handleDownload = () => {
      switch (task.status) {
        case 'IDLE':
        case 'FAILED':
          DownloadEngine.enqueue(selectedEpisode, podcast?.id);
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

      if (isHistoricallyDownladed && task.status === 'IDLE') {
        DownloadEngine.cancel(selectedEpisode.id);
      };
    };

    return (
      <View>
        <AnimatedMaskedView
          style={[{
            position: "absolute",
            top: 0,
            right: 0,
            left: 0,
            height: insets.top + 116,
            zIndex: 20,
          }, blurLayoutOpacity]}
          maskElement={
            <LinearGradient
              style={StyleSheet.absoluteFill}
              colors={['rgba(11, 11, 11, 1)', 'rgba(11, 11, 11, 0)']}
              start={{ x: 0, y: 0.6 }}
              end={{ x: 0, y: 1 }}
            />
          }
        >
          <BlurView
            intensity={50}
            tint='dark'
            style={{
              height: '100%',
              width: '100%',
              backgroundColor: "rgba(11, 11, 11, 0.6)"
            }}
          />
        </AnimatedMaskedView>

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
          }]}
        >
          <TouchableOpacity
            onPress={() => {
              router.back();
            }}
            style={{
              height: 48,
              width: 48,
              borderRadius: 24,
              alignItems: "center",
              shadowOpacity: 0.12,
              shadowColor: "rgb(0, 0, 0)",
              shadowOffset: {
                height: 2,
                width: 1,
              },
              shadowRadius: 8,
              overflow: "hidden",
            }}
          >
            <BlurView
              intensity={18}
              style={StyleSheet.absoluteFill}
            />
            <View
              style={[StyleSheet.absoluteFill, ButtonStyle.backbutton]}
            >
              <ChevronLeft size={26} color={'rgb(255, 255, 255)'} />
            </View>
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
                color: "rgb(255, 255, 255)",
                width: 297,
              }}
            >
              {selectedEpisode?.title}
            </Text>
          </Animated.View>

        </Animated.View>

        <Animated.ScrollView
          style={{
            paddingTop: HEADER_HEIGHT + insets.top,
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
                  color: 'rgba(255, 255, 255, 0.6)'
                }}
              >
                {podcast?.title}
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
                  source={{ uri: selectedEpisode.image }}
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
                    textAlign: "center",
                    color: 'rgba(255, 255, 255, 0.6)'
                  }}
                >
                  {formatDate(selectedEpisode.publishDate)} &#8226; {formatDuration(selectedEpisode.duration)}
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
                    textAlign: "center",
                    color: "rgba(255, 255, 255, 1)"
                  }}
                >
                  {selectedEpisode.title}
                </Text>

              </View>
            </View>

            {/* CTAs buttons */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 12,
                paddingHorizontal: 20
              }}
            >
              <Pressable
                style={[{
                  height: 50,
                  width: 50,
                  borderRadius: 128,
                  justifyContent: "center",
                  alignItems: "center",
                  paddingRight: 4
                }, ButtonStyle.singleButton]}
              >
                <Share2 size={24} strokeWidth={1.8} color='rgb(255, 255, 255)' />
              </Pressable>

              <View
                style={[{
                  height: 50,
                  borderRadius: 128,
                  alignItems: "center",
                  backgroundColor: 'rgba(255, 255, 255, 0.04)',
                  paddingLeft: 4,
                  flexDirection: "row",
                }, ButtonStyle.buttonGroup]}
              >
                <Pressable
                  onPress={handleSave}
                  style={{
                    height: 50,
                    width: 48,
                    borderRadius: 88,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Save size={22}
                    strokeWidth={2}
                    fill={isSaved ? 'rgb(255, 255, 255)' : 'none'}
                    color='rgb(255, 255, 255)'
                  />
                </Pressable>

                <Pressable
                  onPress={handleDownload}
                  style={{
                    height: 50,
                    width: 48,
                    borderRadius: 88,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {
                    isHistoricallyDownladed || task.status === 'COMPLETED'
                      ? <Downloaded size={28} fill='rgb(255, 255, 255)' />
                      : <AnimatedDownloadIcon episode={selectedEpisode} />
                  }
                </Pressable>

                <Pressable
                  onPress={() => {
                    setTappedEpisode(selectedEpisode);
                    setPodcastId(podcastId);
                    openModal("episode");
                  }}
                  style={{
                    height: 50,
                    width: 48,
                    borderRadius: 88,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <EllipsisVertical size={22} strokeWidth={2} color={'rgb(255, 255, 255)'} />
                </Pressable>

              </View>

              <TouchableOpacity
                onPress={() => handlePlay()}
                style={[{
                  height: 50,
                  width: 50,
                  borderRadius: 128,
                  justifyContent: "center",
                  alignItems: "center",
                }, ButtonStyle.singleButton]}
              >
                <Play size={22} strokeWidth={2} fill={"rgb(255, 255, 255)"} color={'rgb(255, 255, 255)'} />
              </TouchableOpacity>

            </View>
          </View>

          <View
            style={{
              paddingHorizontal: 20,
              paddingTop: 16
            }}
          >
            <View
              style={{
                paddingBottom: 12
              }}
            >
              <Text
                style={{
                  fontFamily: "SF Pro",
                  fontSize: 22,
                  fontWeight: "600",
                  lineHeight: 32,
                  color: "rgb(255, 255, 255)"
                }}
              >
                About
              </Text>
            </View>
            <Text
              style={{
                fontFamily: "SF Pro",
                fontSize: 14,
                fontWeight: "400",
                lineHeight: 20,
                color: "rgb(255, 255, 255)"
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
  }

};

export default EpisodeDetail;