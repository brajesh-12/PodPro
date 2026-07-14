import { View, Text, ScrollView, FlatList, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import useSearchStore, { Category } from '@/store/useSearchStore';
import Section from '@/components/Section';
import { fetchPodcasts } from '@/services/podcastAPI';
import { Podcast } from '@/store/usePodcastStore';
import PodcastCard from '@/components/PodcastCard';

const GenreScreen = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [subGenres, setSubGenres] = useState<Category[]>([]);

  const { selectedCategory, categoryTopPodcasts, setCategoryTitle } = useSearchStore();

  useEffect(() => {
    if (selectedCategory?.subGenres) {
      setSubGenres(selectedCategory.subGenres);
    }
  }, [selectedCategory]);

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
            {selectedCategory?.name}
          </Text>
        </View>
      </View>

      {subGenres.length > 0
        ? (
          <ScrollView
            bounces={false}
            nestedScrollEnabled={true}
            contentContainerStyle={{
              paddingBottom: 250,
              paddingTop: insets.top
            }}
          >
            <Section title="Top Shows" data={categoryTopPodcasts} tab='search'
              onPress={() => {
                setCategoryTitle("Top Shows");
                if (selectedCategory) {
                  router.navigate({
                    pathname: "/(tabs)/(search)/[code]",
                    params: { code: selectedCategory?.code }
                  });
                }
              }}
            />

            <FlatList
              data={subGenres}
              scrollEnabled={false}
              keyExtractor={(item) => item.code}
              renderItem={({ item }) => <SubGenre item={item} />}
            />
          </ScrollView>
        )
        : (
          <FlatList
            data={categoryTopPodcasts}
            keyExtractor={(item) => item.id.toString()}
            renderItem={(({ item }) => <PodcastCard item={item} tab='search' />)}
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
        )
      }
    </View>
  );
};

const SubGenre = ({ item }: { item: any }) => {
  const router = useRouter();

  const [data, setData] = useState<Podcast[]>([]);
  const { setCategoryTitle } = useSearchStore();

  const fetchData = async () => {
    const response = await fetchPodcasts(item.code, 6);
    setData(response);
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);

  return (
    <Section title={item.name} data={data} tab='search'
      onPress={() => {
        setCategoryTitle(item.name);
        router.navigate({
          pathname: "/(tabs)/(search)/[code]",
          params: { code: item.code }
        });
      }}
    />
  );
};

export default GenreScreen;