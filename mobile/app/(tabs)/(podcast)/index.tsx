import { View, FlatList } from 'react-native'
import React, { useEffect } from 'react';
import { SubscriptionHeader } from '@/components/Header';
import EpisodeCard from '@/components/EpisodeCard';
import useSubscriptionStore from '@/store/useSubscriptionStore';

const Podcasts = () => {
  
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

  return (
    <View
      style={{
        position: "relative"
      }}
    >
      {/* This is feed */}
      <FlatList
        scrollEnabled={true}
        showsVerticalScrollIndicator={false}
        data={feed}
        onEndReached={ !isSelected ? handleFeed : handleSinglePod}
        onEndReachedThreshold={0.1}
        ListHeaderComponent={SubscriptionHeader}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <EpisodeCard episode={item} />}
      />

    </View>
  )
}

export default Podcasts;