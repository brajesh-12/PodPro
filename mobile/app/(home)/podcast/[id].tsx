import { View, ScrollView, TouchableOpacity } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { ArrowLeft, EllipsisVertical } from 'lucide-react-native';
import PodInfo from '@/components/PodInfo';
import { usePodcastStore } from '@/store/usePodcastStore';
import { useEffect } from 'react';
import Episodes from '@/components/Episodes';

const PodcastDetail = () => {
  const { id } = useLocalSearchParams();
  const podcastId = Array.isArray(id) ? id[0] : id;
  
  const router = useRouter();

  const {fetchPod, podcast, fetchEpisodesData} = usePodcastStore();

  useEffect(() => {
    fetchPod(podcastId);

  }, [fetchPod, podcastId]);

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

export default PodcastDetail;
