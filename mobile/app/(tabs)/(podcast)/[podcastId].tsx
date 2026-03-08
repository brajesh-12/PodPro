import { View, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import useSubscriptionStore from '@/store/useSubscriptionStore';
import { usePodcastStore } from '@/store/usePodcastStore';
import API from '@/services/api';
import { useEffect } from 'react';
import { ArrowLeft, EllipsisVertical } from 'lucide-react-native';
import PodInfo from '@/components/PodInfo';
import Episodes from '@/components/Episodes';

const Podcast = () => {
  const { id } = useLocalSearchParams();
  const podcastId = Array.isArray(id) ? id[0] : id;
  const numId = Number(podcastId);
  
  const router = useRouter();

  const { fetchPod, podcast, fetchEpisodesData, setPodcast } = usePodcastStore();
  const { subscriptionIds } = useSubscriptionStore();

  console.log("SubscriptionIds:",subscriptionIds);

  const isSubscribed = subscriptionIds.has(numId);
  console.log(isSubscribed);

  const fetchingPodcast = async () => {
    if(isSubscribed) {
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
    if(podcast) {
      fetchEpisodesData(podcast.feedUrl);
    }
  }, [fetchEpisodesData, podcast]);


  return (
    <ScrollView>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          height: 48,
          paddingLeft: 12,
          paddingRight: 8
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            alignItems: "center",
            justifyContent: "center",
            height: 36,
            width: 36,
            borderRadius: 72
          }}
        >
          <ArrowLeft size={24} strokeWidth={2}/>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            alignItems: "center",
            justifyContent: "center",
            height: 36,
            width: 36,
            borderRadius: 72
          }}
        >
          <EllipsisVertical size={24} strokeWidth={2}/>
        </TouchableOpacity>
      </View>

      {/* Top Section */}
      <PodInfo/>
      <Episodes/>

    </ScrollView>
  )
}

export default Podcast;