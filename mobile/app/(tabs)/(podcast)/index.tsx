import { View } from 'react-native';
import React, { useEffect } from 'react';
import { SubscriptionHeader } from '@/components/Header';
import EpisodeCard from '@/components/EpisodeCard';
import useSubscriptionStore from '@/store/useSubscriptionStore';
import Animated, { clamp, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';

const HEADER_HEIGHT = 178;

const PodcastsScreen = () => {
  
  const { setFollowingPodcasts, fetchFeed, feed, currentPage, hasNextPage, isSelected, singlePodFeed, } = useSubscriptionStore();

  // const [feed, setFeed] = useState<SavedEpisode[]>([]);
  // const [currentPage, setCurrentPage] = useState(1);
  // const [hasNextPage, setHasNextPage] = useState(false);

  // const fetchFeed = async (pageNum: number) => {
  //   try {
  //     const response = await API.followingFeed(pageNum);
  //     const episodes = response.episodes.map((ep: any) => ({
  //       podcastId: ep.podcastId,
  //       episodeId: ep._id,
  //       id: ep.episodeId,
  //       title: ep.title,
  //       description: ep.description,
  //       publishDate: ep.publishDate,
  //       audioUrl: ep.audioUrl,
  //       duration: ep.duration,
  //       image: ep.image,
  //       podcastTitle: ep.podcastTitle
  //     }));

  //     if (pageNum > 1) {
  //       const newFeed = [...feed, ...episodes];
  //       setFeed(newFeed);

  //     } else {
  //       setFeed(episodes);
  //     }

  //     const currentPage = response.currentPage;
  //     const nextPage = response.hasNextPage;
  //     console.log(nextPage);

  //     setCurrentPage(currentPage);
  //     setHasNextPage(nextPage);
  //   } catch (error) {
  //     console.log("Error fetching feed:", error);
  //   }
  // };

  const handleFeed = async () => {
    console.log("Running handleFeed");
    if (hasNextPage) {
      await fetchFeed(currentPage + 1);
    }
  };

  const handleSinglePod = async () => {
    console.log("Setting SinglePod Feed.");
    if(hasNextPage) {
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

      if(currentScrollY <= 0) {
        translateY.value = 0;
      } else {
        translateY.value = clamp(translateY.value - diff, -HEADER_HEIGHT, 0);
      }

      lastTranslateY.value = currentScrollY;
    }
  });

  const headerStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateY: translateY.value}]
    };
  });

  return (
    <View
      style={{
        position: "relative"
      }}
    >
      {/* Header */}
      <SubscriptionHeader style={headerStyle}/>

      {/* This is feed */}
      <Animated.FlatList
        scrollEnabled={true}
        showsVerticalScrollIndicator={false}
        data={feed}
        onEndReached={ !isSelected ? handleFeed : handleSinglePod}
        onEndReachedThreshold={0.1}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <EpisodeCard episode={item} />}
        onScroll={scrollHandler}
        bounces={false}
        scrollEventThrottle={16}
        overScrollMode="never"
        style={{
          paddingTop: 190
        }}
      />

    </View>
  )
}

export default PodcastsScreen;