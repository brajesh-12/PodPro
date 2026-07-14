import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import PodcastCard from '@/components/PodcastCard';
import { Podcast, usePodcastStore } from '@/store/usePodcastStore';
import { fetchPodcasts } from '@/services/podcastAPI';

const CategoryScreen = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const { code } = useLocalSearchParams();
  const codeString = Array.isArray(code) ? code[0] : code;

  const {categoryTitle} = usePodcastStore()
  const [data, setData] = useState<Podcast[]>([]);

  const fetchCategoryPodcasts = async() => {
    const podcasts = await fetchPodcasts(codeString, 50);
    setData(podcasts);
  };

  useEffect(() => {
    fetchCategoryPodcasts()
    // eslint-disable-next-line
  }, [])

  return (
    <View
      style={{
        flex: 1,
        paddingTop: insets.top
      }}
    >
      {/* Header */}
      <View
        style={{
          position: "absolute",
          height: 48,
          top: insets.top,
          right: 0,
          left: 0,
          paddingHorizontal: 16,
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
          marginBottom: 12,
          zIndex: 100,
          backgroundColor: "rgb(242, 242, 242)"
        }}
      >
        <TouchableOpacity
          onPress={() => {
            router.back();
          }}
          style={{
            height: 44,
            width: 44,
            justifyContent: "center",
            paddingLeft: 7,
            backgroundColor: "white",
            borderRadius: 100,
            shadowOpacity: 0.12,
            shadowColor: "rgb(0, 0, 0)",
            shadowOffset: {
              height: 2,
              width: 1,
            },
            shadowRadius: 8
          }}
        >
          <ChevronLeft size={26} />
        </TouchableOpacity>

        <View>
          <Text
            style={{
              fontFamily: "SF Pro",
              fontWeight: "600",
              fontSize: 18,
              lineHeight: 28
            }}
          >
            {categoryTitle}
          </Text>
        </View>
      </View>

      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={(({ item }) => <PodcastCard item={item} tab='home'/>)}
        numColumns={2}
        contentContainerStyle={{
          paddingHorizontal: 22,
          paddingTop: insets.top + 12,
          paddingBottom: 200,
        }}
        columnWrapperStyle={{
          justifyContent: "space-between"
        }}
        bounces={false}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default CategoryScreen;