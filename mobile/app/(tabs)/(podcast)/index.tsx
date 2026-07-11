import { StatusBar, Text, View } from 'react-native';
import React, { useEffect } from 'react';
import { SubscriptionHeader } from '@/components/Header';
import EpisodeCard from '@/components/EpisodeCard';
import useSubscriptionStore from '@/store/useSubscriptionStore';
import Animated, { clamp, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';

const HEADER_HEIGHT = 182;

const PodcastsScreen = () => {

  const { setFollowingPodcasts,
    fetchFeed,
    feed,
    currentPage,
    hasNextPage,
    isSelected,
    singlePodFeed,
    followingPodcasts,
  } = useSubscriptionStore();

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

  if (followingPodcasts.length <= 0) {
    return (
      <View
        style={{
          flex: 1,
          paddingTop: insets.top,
          backgroundColor: "rgb(15, 15, 15)"
        }}
      >
        <StatusBar
          barStyle={"light-content"}
        />
        {/* Header */}
        <View
          style={{
            paddingHorizontal: 20,
            height: 48
          }}
        >
          <View>
            <Text
              style={{
                fontFamily: "SF Pro",
                fontSize: 24,
                fontWeight: "700",
                lineHeight: 32,
                color: "white"
              }}
            >
              Podcasts
            </Text>
          </View>
        </View>

        <View
          style={{
            paddingTop: 16
          }}
        >
          <View
            style={{
              width: "100%",
              paddingVertical: 40,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View
              style={{
                height: 227,
                width: 240
              }}
            >
              <Image
                style={{
                  height: "100%",
                  width: "100%",
                }}
                contentFit="cover"
                source={require('../../../assets/images/empty-state-illustration.png')}
              />
            </View>
          </View>

          <View
            style={{
              paddingHorizontal: 20
            }}
          >
            <View
              style={{
                paddingBottom: 8
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontFamily: "SF Pro",
                  fontSize: 22,
                  fontWeight: "600",
                  lineHeight: 28,
                  textAlign: "center"
                }}
              >
                New episodes straight to you
              </Text>
            </View>
            <View>
              <Text
                style={{
                  color: "rgba(250, 250, 250, 0.6)",
                  fontFamily: "SF Pro",
                  fontSize: 19,
                  fontWeight: "400",
                  lineHeight: 26,
                  textAlign: "center"
                }}
              >
                Follow to get the latest episodes from podcasts that you love.
              </Text>
            </View>
          </View>

          <View
            style={{
              paddingHorizontal: 20,
              paddingVertical: 48
            }}
          >
            <View
              style={{
                height: 48,
                backgroundColor: "yellow",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 32
              }}
            >
              <Text
                style={{
                  color: 'black',
                  fontFamily: "SF Pro",
                  fontSize: 16,
                  fontWeight: "600"
                }}
              >
                Explore Podcasts
              </Text>
            </View>
          </View>
        </View>

      </View>
    );
  };

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
        renderItem={({ item }) => <EpisodeCard episode={item} tab='podcasts'/>}
        onScroll={scrollHandler}
        bounces={false}
        scrollEventThrottle={16}
        overScrollMode="never"
        contentContainerStyle={{
          paddingTop: isSelected ? 190 + insets.top : 142 + insets.top,
          paddingBottom: 120
        }}
      />

    </View>
  );
};

export default PodcastsScreen;