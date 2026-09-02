import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import useSubscriptionStore from '@/store/useSubscriptionStore';
import { ChevronLeft, EllipsisVertical } from 'lucide-react-native';
import PodInfo from '@/components/PodInfo';
import EpisodeCard from '@/components/EpisodeCard';
import Animated, { useAnimatedScrollHandler, useAnimatedStyle, useSharedValue, createAnimatedComponent } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import useModalStore from '@/store/useModalStore';
import ButtonStyle from '@/constants/buttonStyles';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';

const AnimatedMaskedView = createAnimatedComponent(MaskedView);

const HEADER_HEIGHT = 48

const Podcast = () => {
  const { podcastId } = useLocalSearchParams();
  const insets = useSafeAreaInsets();

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

  return (
    <View
      style={{
        flex: 1
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
        scrollEnabled={true}
        showsVerticalScrollIndicator={false}
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={renterItem}
        onEndReached={handleFeed}
        onEndReachedThreshold={0.1}
        bounces={false}
        style={{
          paddingTop: HEADER_HEIGHT + insets.top + 16
        }}
        onScroll={onScroll}
      />

    </View>
  );
}

export default Podcast;