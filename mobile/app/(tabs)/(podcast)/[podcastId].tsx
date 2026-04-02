import { View, ScrollView, TouchableOpacity, Text, FlatList } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import useSubscriptionStore from '@/store/useSubscriptionStore';
import { ArrowLeft, Search } from 'lucide-react-native';
import PodInfo from '@/components/PodInfo';
import EpisodeCard from '@/components/EpisodeCard';

const Podcast = () => {
  const { podcastId } = useLocalSearchParams();
  const id = Array.isArray(podcastId) ? podcastId[0] : podcastId;
  const numId = Number(id);

  const router = useRouter();

  const { selectedPodcast, singlePodFeed, feed, hasNextPage, currentPage } = useSubscriptionStore();

  const handleFeed = () => {
    if(hasNextPage) {
      singlePodFeed(currentPage + 1);
    };
  };

  return (
    <ScrollView
    >
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
      </View>

      {/* Top Section */}
      <PodInfo podcast={selectedPodcast} />
      <View>
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

        <FlatList
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
          data={feed}
          keyExtractor={(item) => item.id}
          renderItem={({item}) => <EpisodeCard episode={item}/>}
          onEndReached={handleFeed}
          onEndReachedThreshold={0.1}
        />
      </View>

    </ScrollView>
  )
}

export default Podcast;