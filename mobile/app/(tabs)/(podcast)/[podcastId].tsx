import { View, TouchableOpacity, Text } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import useSubscriptionStore from '@/store/useSubscriptionStore';
import { ArrowLeft, Search } from 'lucide-react-native';
import PodInfo from '@/components/PodInfo';
import EpisodeCard from '@/components/EpisodeCard';
import Animated, { interpolateColor, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const HEADER_HEIGHT = 48
const TRIGGER_POINT = 320;

const Podcast = () => {
  const { podcastId } = useLocalSearchParams();

  // eslint-disable-next-line
  const id = Array.isArray(podcastId) ? podcastId[0] : podcastId;
  // const numId = Number(id);

  const router = useRouter();

  const { selectedPodcast, singlePodFeed, feed, hasNextPage, currentPage } = useSubscriptionStore();

  const data = [{ id: "PodInfo_id", type: "header" }, { id: "tab_id", type: "tabs" }, ...feed];

  const handleFeed = () => {
    if (hasNextPage) {
      singlePodFeed(currentPage + 1);
    };
  };

  const scrollY = useSharedValue(0);

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    }
  });

  const headerStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      scrollY.value,
      [TRIGGER_POINT, TRIGGER_POINT + 66],
      ['rgba(242, 242, 242, 0)', 'rgba(242, 242, 242, 1)']
    )
    return { backgroundColor }
  });

  const titleOpacity = useAnimatedStyle(() => {
    const isSticky = scrollY.value >= TRIGGER_POINT + 66;

    return {
      opacity: isSticky ? 1 : 0
    };
  });

  const renterItem = ({ item }: { item: any }) => {
    if (item.type === 'header') {
      return (
        <PodInfo podcast={selectedPodcast} />
      )
    } else if (item.type === 'tabs') {
      return (
        <Animated.View
          style={{backgroundColor: "rgb(242, 242, 242)"}}
        >
          <View
            style={{
              flexDirection: "row",
              gap: '8',
              paddingLeft: 20,
              alignItems: "center",
              height: 44
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
      )
    }

    return (
      <EpisodeCard episode={item} />
    )
  }

  const insets = useSafeAreaInsets()

  return (
    <View
      style={{paddingTop: insets.top}}
    >
      {/* Header section */}
      <Animated.View
        style={[{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          height: HEADER_HEIGHT,
          paddingLeft: 12,
          paddingRight: 8,
          position: "absolute",
          top: insets.top,
          right: 0,
          left: 0,
          zIndex: 10
        }, headerStyle]}
      >

        <View
          style={{
            flexDirection: 'row',
            alignItems: "center",
            gap: 8
          }}
        >
          <TouchableOpacity
            onPress={() => {
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
            style={titleOpacity}
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
              {selectedPodcast?.title}
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
          <Search size={24} strokeWidth={2} />
        </TouchableOpacity>
      </Animated.View>

      {/* Top Section */}
      {/* <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        bounces={false}
      > */}
      {/* <PodInfo podcast={selectedPodcast} /> */}

      <Animated.FlatList
        scrollEnabled={true}
        showsVerticalScrollIndicator={false}
        data={data}
        keyExtractor={(item) => item.id}
        stickyHeaderIndices={[1]}
        renderItem={renterItem}
        onEndReached={handleFeed}
        onEndReachedThreshold={0.1}
        bounces={false}
        style={{
          paddingTop: HEADER_HEIGHT
        }}
        onScroll={onScroll}
      />

      {/* </Animated.ScrollView> */}

    </View>
  );
}

export default Podcast;