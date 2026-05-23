import { View, TouchableOpacity, Text } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { ArrowLeft, Search } from 'lucide-react-native';
import PodInfo from '@/components/PodInfo';
import { usePodcastStore } from '@/store/usePodcastStore';
import { useEffect } from 'react';
import Episodes from '@/components/Episodes';
import useSubscriptionStore from '@/store/useSubscriptionStore';
import API from '@/services/api';
import Animated, { useAnimatedScrollHandler, useAnimatedStyle, useSharedValue, interpolateColor } from 'react-native-reanimated';

const HEADER_HEIGHT = 48;
const TRIGGER_POINT = 320;

const PodcastDetail = () => {
  const { id } = useLocalSearchParams();
  const podcastId = Array.isArray(id) ? id[0] : id;
  const numId = Number(podcastId);

  const router = useRouter();

  const { fetchPod, podcast, fetchEpisodesData, setPodcast, resetPodcast } = usePodcastStore();
  const { subscriptionIds } = useSubscriptionStore();

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

  const scrollY = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    }
  });

  const opacityStyle = useAnimatedStyle(() => {
    const scrolled = scrollY.value >= TRIGGER_POINT + 66;

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

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "rgb(242, 242, 242)"
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
          top: 0,
          zIndex: 10
        }, backgroundStyle]}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 8
          }}
        >
          <TouchableOpacity
            onPress={() => {
              resetPodcast();
              router.back();
            }}
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
            style={opacityStyle}
          >
            <Text
              style={{
                fontFamily: "SF Pro",
                fontWeight: "600",
                fontSize: 16,
                lineHeight: 24,
                color: "black"
              }}
            >
              {podcast?.title}
            </Text>
          </Animated.View>

        </View>

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
          <Search size={24} />
        </TouchableOpacity>
      </Animated.View>

      {/* Top Section */}
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        bounces={false}
        style={{
          paddingTop: HEADER_HEIGHT
        }}
        onScroll={onScroll}
        scrollEnabled={true}
        stickyHeaderIndices={[1]}
        scrollEventThrottle={16}
      >
        <PodInfo podcast={podcast} />

        {/* Filter */}
        <Animated.View
          style={{
            backgroundColor: "rgb(242, 242, 242)"
          }}
        >
          <View
            style={{
              flexDirection: "row",
              gap: '8',
              paddingLeft: 20,
              alignItems: "center",
              height: 44,
            }}
          >
            <View
              style={{
                paddingHorizontal: 10,
                paddingVertical: 6,
                borderRadius: 6,
                backgroundColor: "black",
                flexWrap: "wrap",
                alignItems: "center"
              }}
            >
              <Text
                style={{
                  fontFamily: "SF Pro",
                  fontSize: 14,
                  fontWeight: "500",
                  lineHeight: 16,
                  color: "white"
                }}
              >
                Episodes
              </Text>
            </View>

            <View
              style={{
                paddingHorizontal: 10,
                paddingVertical: 6,
                borderRadius: 6,
                backgroundColor: "rgb(217, 217, 217)",
                flexWrap: "wrap",
                alignItems: "center"
              }}
            >
              <Text
                style={{
                  fontFamily: "SF Pro",
                  fontSize: 14,
                  fontWeight: "400",
                  lineHeight: 16
                }}
              >
                More like this
              </Text>
            </View>
          </View>
        </Animated.View>

        {!podcast?.feedUrl
          ? (
            <View>
              <Text>
                Premimum members only
              </Text>
            </View>
          )
          : <Episodes />
        }
      </Animated.ScrollView>
    </View>
  )
}

export default PodcastDetail;
