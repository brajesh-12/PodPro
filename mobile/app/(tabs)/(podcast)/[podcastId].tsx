import { View, TouchableOpacity, Text } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import useSubscriptionStore from '@/store/useSubscriptionStore';
import { ChevronLeft, EllipsisVertical } from 'lucide-react-native';
import PodInfo from '@/components/PodInfo';
import EpisodeCard from '@/components/EpisodeCard';
import Animated, { interpolateColor, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import useModalStore from '@/store/useModalStore';

const HEADER_HEIGHT = 48
const TRIGGER_POINT = 320;

const Podcast = () => {
  const { podcastId } = useLocalSearchParams();

  // eslint-disable-next-line
  const id = Array.isArray(podcastId) ? podcastId[0] : podcastId;
  // const numId = Number(id);

  const router = useRouter();

  const { selectedPodcast, singlePodFeed, feed, hasNextPage, currentPage } = useSubscriptionStore();
  const { setTappedPodcast, openModal } = useModalStore();

  const data = [{ id: "PodInfo_id", type: "podInfo" }, { id: "header_id", type: "heading" }, ...feed];

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
      ['rgba(11, 11, 11, 0)', 'rgba(11, 11, 11, 1)']
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
    if (item.type === 'podInfo') {
      return (
        <PodInfo podcast={selectedPodcast} description={selectedPodcast?.description} />
      )
    } else if (item.type === 'heading') {
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

            {/* <View>
              <ChevronRight size={22} />
            </View> */}
          </View>
        </View>
      )
    }

    return (
      <EpisodeCard episode={item} tab='Podcasts' />
    )
  };

  const insets = useSafeAreaInsets()

  return (
    <View
      style={{
        paddingTop: insets.top,
        backgroundColor: "rgb(11, 11, 11)"
      }}
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
              backgroundColor: "rgb(255, 255, 255, 0.2)",
              borderRadius: 100,
              shadowOpacity: 0.12,
              shadowColor: "rgb(0, 0, 0)",
              shadowOffset: {
                height: 2,
                width: 1,
              },
              shadowRadius: 8,
              overflow: "hidden"
            }}
          >
            <BlurView
              tint='dark'
              intensity={22}
              style={{
                height: "100%",
                width: "100%",
                justifyContent: "center",
                paddingLeft: 7,
                backgroundColor: "rgba(255, 255, 255, 0.1)"
              }}
            >
              <ChevronLeft size={26} color={'rgb(255, 255, 255)'} />
            </BlurView>
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
                color: "rgb(255, 255, 255)"
              }}
            >
              {selectedPodcast?.title}
            </Text>
          </Animated.View>
        </View>

        <TouchableOpacity
          onPress={() => {
            setTappedPodcast(selectedPodcast);
            openModal("podcast");
          }}
          style={{
            height: 44,
            width: 44,
            backgroundColor: "rgb(255, 255, 255, 0.2)",
            borderRadius: 100,
            shadowOpacity: 0.12,
            shadowColor: "rgb(0, 0, 0)",
            shadowOffset: {
              height: 2,
              width: 1,
            },
            shadowRadius: 8,
            overflow: "hidden"
          }}
        >
          <BlurView
            tint='dark'
            intensity={22}
            style={{
              height: "100%",
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(255, 255, 255, 0.1)"
            }}
          >
            <EllipsisVertical size={22} color={'rgb(255, 255, 255)'} />
          </BlurView>
        </TouchableOpacity>
      </Animated.View>

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