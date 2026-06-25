import { View, Text, Pressable, ScrollView, FlatList, TouchableOpacity } from 'react-native'
import { useEffect, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import useSearchStore, { Category } from '@/store/useSearchStore';
import Section from '@/components/Section';
import { fetchPodcasts } from '@/services/podcastAPI';
import { Podcast } from '@/store/usePodcastStore';
import { Image } from 'expo-image';
import useModalStore from '@/store/useModalStore';

const GenreScreen = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [subGenres, setSubGenres] = useState<Category[]>([]);

  const { selectedCategory, categoryTopPodcasts } = useSearchStore();

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
        <Pressable
          onPress={() => {
            router.back();
          }}
          style={{
            height: 44,
            width: 44,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 32,
            backgroundColor: 'grey'
          }}
        >
          <ChevronLeft size={22} strokeWidth={1.8} />
        </Pressable>

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
            <Section title="Top Shows" data={categoryTopPodcasts} />

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
            renderItem={(({item}) => <PodcastCard item={item}/>)}
            numColumns={2}
            contentContainerStyle={{
              paddingHorizontal: 20,
              paddingTop: insets.top + 12,
              paddingBottom: 200
            }}
            columnWrapperStyle={{
              gap: 16
            }}
            bounces={false}
          />
        )
      }
    </View>
  );
};

const SubGenre = ({ item }: { item: any }) => {
  const [data, setData] = useState<Podcast[]>([]);

  const fetchData = async () => {
    const response = await fetchPodcasts(item.code, 6);
    setData(response);
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);

  return (
    <Section title={item.name} data={data} />
  );
};

const PodcastCard = ({ item }: { item: Podcast }) => {
  const router = useRouter();
  const { openModal, setTappedPodcast } = useModalStore();

  return (
    <TouchableOpacity
      onPress={() => router.navigate({
        pathname: "/(tabs)/(search)/podcast/[id]",
        params: { id: item.id }
      })}
      onLongPress={() => {
        openModal('podcast');
        setTappedPodcast(item);
      }}
      style={{
        flexDirection: 'column',
        gap: 12,
        marginBottom: 20
      }}
    >

      {/* Thumbail container */}
      <View
        style={{
          height: 168.5,
          width: 168.5
        }}
      >
        <Image
          source={{ uri: item.thumbnail }}
          style={{
            height: '100%',
            width: '100%',
            borderRadius: 8
          }}
          contentFit='cover'
        />
      </View>

      {/* Text container */}
      <View
        style={{
          flexDirection: 'column',
          gap: 4
        }}
      >
        <Text
          numberOfLines={1}
          ellipsizeMode='tail'
          style={{
            width: 146,
            fontFamily: "SF Pro",
            fontWeight: '500',
            fontSize: 14,
            lineHeight: 16
          }}
        >
          {item.title}
        </Text>

        <Text
          numberOfLines={1}
          ellipsizeMode='tail'
          style={{
            width: 146,
            fontFamily: "SF Pro",
            fontWeight: '400',
            fontSize: 14,
            lineHeight: 16
          }}
        >
          {item.artist}
        </Text>
      </View>
    </TouchableOpacity>
  )
}

export default GenreScreen;