import { View } from 'react-native';
import React, { useEffect } from 'react';
import { SubscriptionHeader } from '@/components/Header';
import EpisodeCard from '@/components/EpisodeCard';
import useSubscriptionStore from '@/store/useSubscriptionStore';
import Animated, { clamp, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const HEADER_HEIGHT = 182;

const PodcastsScreen = () => {

  const { setFollowingPodcasts, fetchFeed, feed, currentPage, hasNextPage, isSelected, singlePodFeed, } = useSubscriptionStore();

  const handleFeed = async () => {
    console.log("Running handleFeed");
    if (hasNextPage) {
      await fetchFeed(currentPage + 1);
    }
  };

  const handleSinglePod = async () => {
    console.log("Setting SinglePod Feed.");
    if (hasNextPage) {
      await singlePodFeed(currentPage + 1);
    }
  }

  useEffect(() => {
    fetchFeed(currentPage);
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    setFollowingPodcasts();
    // eslint-disable-next-line
  }, []);

  const translateY = useSharedValue(0);
  const lastTranslateY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      const currentScrollY = event.contentOffset.y;
      const diff = currentScrollY - lastTranslateY.value;

      if (currentScrollY <= 0) {
        translateY.value = 0;
      } else {
        translateY.value = clamp(translateY.value - diff, -HEADER_HEIGHT, 0);
      }

      lastTranslateY.value = currentScrollY;
    }
  });

  const headerStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }]
    };
  });

  const insets = useSafeAreaInsets();

  return (
    <View
      collapsable={false}
      style={{
        flex: 1,
      }}
    >
      <View
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          left: 0,
          paddingTop: insets.top,
          backgroundColor: "rgb(242, 242, 242)",
          zIndex: 30
        }}
      />
      {/* Header */}
      <SubscriptionHeader style={headerStyle} />

      {/* This is feed */}
      <Animated.FlatList
        scrollEnabled={true}
        showsVerticalScrollIndicator={false}
        data={feed}
        onEndReached={!isSelected ? handleFeed : handleSinglePod}
        onEndReachedThreshold={0.1}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <EpisodeCard episode={item} />}
        onScroll={scrollHandler}
        bounces={false}
        scrollEventThrottle={16}
        overScrollMode="never"
        contentContainerStyle={{
          paddingTop: 190 + insets.top,
          paddingBottom: 120
        }}
      />

    </View>
  );
};

export default PodcastsScreen;