import { View, ScrollView, TouchableOpacity, Text } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { ArrowLeft, Search } from 'lucide-react-native';
import PodInfo from '@/components/PodInfo';
import { usePodcastStore } from '@/store/usePodcastStore';
import { useEffect } from 'react';
import Episodes from '@/components/Episodes';
import useSubscriptionStore from '@/store/useSubscriptionStore';
import API from '@/services/api';

const PodcastDetail = () => {
  const { id } = useLocalSearchParams();
  const podcastId = Array.isArray(id) ? id[0] : id;
  const numId = Number(podcastId);
  
  const router = useRouter();

  const { fetchPod, podcast, fetchEpisodesData, setPodcast, resetPodcast } = usePodcastStore();
  const { subscriptionIds } = useSubscriptionStore();

  const isSubscribed = subscriptionIds.has(numId);

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

      {/* navigation header */}
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
          <ArrowLeft size={24} strokeWidth={2}/>
        </TouchableOpacity>

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
          <Search size={24}/>
        </TouchableOpacity>
      </View>

      {/* Top Section */}
      <PodInfo podcast={podcast}/>

      { !podcast?.feedUrl 
        ? (
          <View>
            <Text>
              Premimum members only
            </Text>
          </View>
        )
        : <Episodes/>
      }

    </ScrollView>
  )
}

export default PodcastDetail;
