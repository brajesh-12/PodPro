import { View, TouchableOpacity, Text } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { ChevronRight, ChevronLeft, EllipsisVertical } from 'lucide-react-native';
import PodInfo from '@/components/PodInfo';
import { useEffect, useState } from 'react';
import useSubscriptionStore from '@/store/useSubscriptionStore';
import API from '@/services/api';
import Animated, { useAnimatedScrollHandler, useAnimatedStyle, useSharedValue, interpolateColor } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useSearchStore from '@/store/useSearchStore';
import EpisodeCard from '@/components/EpisodeCard';
import useModalStore from '@/store/useModalStore';

const HEADER_HEIGHT = 48;
const TRIGGER_POINT = 320;

const PodcastDetail = () => {
  const { id } = useLocalSearchParams();
  const podcastId = Array.isArray(id) ? id[0] : id;
  const numId = Number(podcastId);

  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [podInfoContainerHeight, setContainerHeight] = useState(0)

  const { setTappedPodcast, openModal } = useModalStore();
  const {
    searchedPodcast,
    setSearchedPodcast,
    episodes,
    setEpisodes,
    episodesToRender,
    setEpisodesToRender,
    fetchSearchedPodcast
  } = useSearchStore();

  const [page, setPage] = useState(1);
  const EPISODES_PER_PAGE = 10;

  const { subscriptionIds } = useSubscriptionStore();

  const isSubscribed = subscriptionIds.has(numId);

  const fetchingPodcast = async () => {
    if (isSubscribed) {
      const podcast = await API.podcast(numId);
      setSearchedPodcast(podcast);
      console.log("Fetching podcast from database.");

    } else {
      fetchSearchedPodcast(podcastId);
    }
  };

  useEffect(() => {
    fetchingPodcast();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (searchedPodcast) {
      setEpisodes(searchedPodcast.feedUrl);
    }
  }, [setEpisodes, searchedPodcast]);

  const loadEpisodesToRender = () => {
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
    const scrolled = scrollY.value >= podInfoContainerHeight;

    return {
      opacity: scrolled ? 1 : 0
    }
  });

  const backgroundStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      scrollY.value,
      [TRIGGER_POINT, TRIGGER_POINT + 66],
      [`rgba(242, 242, 242, 0)`, `rgba(242, 242, 242, 1)`]
    )
    return { backgroundColor }
  });

  const data = [{ id: 'podInfo_id', type: 'podInfo' }, { id: 'heading_id', type: 'heading' }, ...episodesToRender];

  const renderItem = ({ item }: { item: any }) => {
    if (item.type === 'podInfo') {
      return (
        <View
          onLayout={(event) => {
            const height = event.nativeEvent.layout.height;
            setContainerHeight(height);
          }}
        >
          <PodInfo podcast={searchedPodcast} />
        </View>
      );
    }
    else if (item.type === 'heading') {
      return (
        <View
          style={{
            backgroundColor: "rgb(242, 242, 242)"
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
                fontWeight: "700"
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
      return <EpisodeCard episode={item} tab='Search' />
    }
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "rgb(242, 242, 242)",
        paddingTop: insets.top
      }}
    >
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
          zIndex: 10
        }, backgroundStyle]}
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
                color: "black"
              }}
            >
              {searchedPodcast?.title}
            </Text>
          </Animated.View>

        </View>

        <TouchableOpacity
          onPress={() => {
            setTappedPodcast(searchedPodcast);
            openModal("podcast");
          }}
          style={{
            height: 44,
            width: 44,
            justifyContent: "center",
            alignItems: "center",
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
          <EllipsisVertical size={22} />
        </TouchableOpacity>
      </Animated.View>

      <Animated.FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        bounces={false}
        onScroll={onScroll}
        onEndReached={loadEpisodesToRender}
        onEndReachedThreshold={0.2}
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[1]}
        style={{
          paddingTop: HEADER_HEIGHT
        }}
        contentContainerStyle={{
          paddingBottom: 300
        }}
      />
    </View>
  )
}

export default PodcastDetail;
