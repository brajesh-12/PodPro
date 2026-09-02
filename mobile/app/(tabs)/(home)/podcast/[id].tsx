import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft, EllipsisVertical, ChevronRight } from 'lucide-react-native';
import PodInfo from '@/components/PodInfo';
import { usePodcastStore } from '@/store/usePodcastStore';
import { useEffect, useState } from 'react';
import useSubscriptionStore from '@/store/useSubscriptionStore';
import API from '@/services/api';
import Animated, { useAnimatedScrollHandler, useAnimatedStyle, useSharedValue, createAnimatedComponent } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import EpisodeCard from '@/components/EpisodeCard';
import useModalStore from '@/store/useModalStore';
import { BlurView } from 'expo-blur';
import ButtonStyle from '@/constants/buttonStyles';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';

const HEADER_HEIGHT = 48;

const AnimatedMaskedView = createAnimatedComponent(MaskedView);

const PodcastDetail = () => {
  const { id } = useLocalSearchParams();
  const podcastId = Array.isArray(id) ? id[0] : id;
  const numId = Number(podcastId);

  const router = useRouter();

  const insets = useSafeAreaInsets();

  const { setTappedPodcast, openModal } = useModalStore();
  const { fetchPod,
    podcast,
    podDescription,
    fetchEpisodesData,
    setPodcast,
    resetPodcast,
    episodes,
    episodesToRender,
    setEpisodesToRender
  } = usePodcastStore();

  const { subscriptionIds } = useSubscriptionStore();

  const [page, setPage] = useState(1);
  const EPISODES_PER_PAGE = 10;

  const isSubscribed = subscriptionIds.has(numId);

  const fetchingPodcast = async () => {
    if (isSubscribed) {
      const podcast = await API.podcast(numId);
      setPodcast(podcast);
      console.log("Fetching podcast from database.");

    } else {
      fetchPod(podcastId);
    }
  }

  useEffect(() => {
    fetchingPodcast();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (podcast) {
      fetchEpisodesData(podcast.feedUrl);
    }
  }, [fetchEpisodesData, podcast]);

  const loadVisibleEpisodes = () => {
    if (episodesToRender.length >= episodes.length) return;

    const nextPage = page + 1;
    const startIndex = 0;
    const endIndex = nextPage * EPISODES_PER_PAGE;

    setEpisodesToRender(episodes.slice(startIndex, endIndex));
    setPage(nextPage);
  };

  const scrollY = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    }
  });

  const opacityStyle = useAnimatedStyle(() => {
    const scrolled = scrollY.value >= 180 + insets.top + HEADER_HEIGHT;

    return {
      opacity: scrolled ? 1 : 0
    }
  });

  const blurLayoutOpacity = useAnimatedStyle(() => {
    const opacity = scrollY.value >= 24 ? 1 : 0
    return { opacity }
  });

  const data = [{ id: 'podInfo_id', type: 'podInfo' }, { id: 'heading_id', type: 'heading' }, ...episodesToRender];

  const renderItem = ({ item }: { item: any }) => {
    if (item.type === 'podInfo') {
      return (
        <View>
          <PodInfo podcast={podcast} description={podDescription} />
        </View>
      );
    }
    else if (item.type === 'heading') {
      return (
        <View
          style={{
            backgroundColor: "rgb(11, 11, 11)"
          }}
        >
          <View
            style={{
              flexDirection: "row",
              gap: 4,
              paddingLeft: 20,
              alignItems: "center",
              paddingVertical: 14
            }}
          >
            <Text
              style={{
                fontFamily: "SF Pro",
                fontSize: 20,
                fontWeight: "700",
                color: 'rgba(255, 255, 255, 0.8)'
              }}
            >
              Episodes
            </Text>

            <View>
              <ChevronRight size={22} />
            </View>
          </View>
        </View>
      );
    }
    else {
      return <EpisodeCard episode={item} tab='Home' />
    }
  };

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <AnimatedMaskedView
        style={[{
          position: "absolute",
          top: 0,
          right: 0,
          left: 0,
          height: insets.top + 124,
          zIndex: 20,
        }, blurLayoutOpacity]}
        maskElement={
          <LinearGradient
            style={StyleSheet.absoluteFill}
            colors={['rgba(11, 11, 11, 1)', 'rgba(11, 11, 11, 0)']}
            start={{ x: 0, y: 0.3 }}
            end={{ x: 0, y: 1 }}
          />
        }
      >
        <BlurView
          intensity={80}
          tint='dark'
          style={{
            height: '100%',
            width: '100%',
            backgroundColor: "rgba(11, 11, 11, 0.6)"
          }}
        />
      </AnimatedMaskedView>

      {/* navigation header */}
      <Animated.View
        style={[{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          height: HEADER_HEIGHT,
          paddingLeft: 12,
          paddingRight: 8,
          position: "absolute",
          right: 0,
          left: 0,
          top: insets.top,
          zIndex: 100
        }]}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 12
          }}
        >
          <TouchableOpacity
            onPress={() => {
              resetPodcast();
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
            style={opacityStyle}
          >
            <Text
              numberOfLines={1}
              ellipsizeMode='tail'
              style={{
                fontFamily: "SF Pro",
                fontWeight: "600",
                fontSize: 18,
                lineHeight: 28,
                color: "rgba(255, 255, 255, 0.9)"
              }}
            >
              {podcast?.title}
            </Text>
          </Animated.View>

        </View>

        <TouchableOpacity
          onPress={() => {
            setTappedPodcast(podcast);
            openModal("podcast");
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
            style={[StyleSheet.absoluteFill, ButtonStyle.backbutton, { justifyContent: "center", paddingLeft: 11 }]}
          >
            <EllipsisVertical size={22} color={'rgb(255, 255, 255)'} />
          </View>
        </TouchableOpacity>
      </Animated.View>

      <Animated.FlatList
        data={data}
        keyExtractor={(item) => item.id}
        scrollEnabled={true}
        showsVerticalScrollIndicator={false}
        renderItem={renderItem}
        onScroll={onScroll}
        bounces={false}
        onEndReached={loadVisibleEpisodes}
        onEndReachedThreshold={0.2}
        style={{
          paddingTop: HEADER_HEIGHT + insets.top + 16
        }}
      />
    </View>
  );
};

export default PodcastDetail;
