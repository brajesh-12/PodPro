import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useEffect, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import useSearchStore from '@/store/useSearchStore';
import Section from '@/components/Section';
import { fetchPodcasts } from '@/services/podcastAPI';
import { Podcast } from '@/store/usePodcastStore';
import PodcastCard from '@/components/PodcastCard';
import Animated, { createAnimatedComponent, useAnimatedScrollHandler, useSharedValue, useAnimatedStyle } from 'react-native-reanimated';
import MaskedView from '@react-native-masked-view/masked-view';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import ButtonStyle from '@/constants/buttonStyles';

const AnimatedMaskedView = createAnimatedComponent(MaskedView);

const GenreScreen = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const { selectedCategory, categoryTopPodcasts, setCategoryTitle } = useSearchStore();

  const subGenres = selectedCategory?.subGenres || [];

  const scrollY = useSharedValue(0)

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    }
  });

  const blurLayoutOpacity = useAnimatedStyle(() => {
    const opacity = scrollY.value >= 24 ? 1 : 0
    return { opacity }
  });

  return (
    <View
      style={{
        flex: 1,
      }}
    >

      <AnimatedMaskedView
        style={[{
          position: "absolute",
          top: 0,
          right: 0,
          left: 0,
          height: insets.top + 100,
          zIndex: 20,
          // backgroundColor: 'red'
        }, blurLayoutOpacity]}
        maskElement={
          <LinearGradient
            style={StyleSheet.absoluteFill}
            colors={['rgba(11, 11, 11, 1)', 'rgba(11, 11, 11, 0)']}
            start={{ x: 0, y: 0.4 }}
            end={{ x: 0, y: 1 }}
          />
        }
      >
        <BlurView
          intensity={60}
          tint='dark'
          style={{
            height: '100%',
            width: '100%',
            backgroundColor: "rgba(11, 11, 11, 0.6)"
          }}
        />
      </AnimatedMaskedView>
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
        }}
      >
        <TouchableOpacity
          onPress={() => {
            router.back();
          }}
          style={{
            height: 48,
            width: 48,
            borderRadius: 24,
            alignItems: "center",
            shadowOpacity: 0.12,
            shadowColor: "rgb(0, 0, 0)",
            shadowOffset: {
              height: 2,
              width: 1,
            },
            shadowRadius: 8,
            overflow: "hidden",
          }}
        >
          <BlurView
            intensity={18}
            style={StyleSheet.absoluteFill}
          />
          <View
            style={[StyleSheet.absoluteFill, ButtonStyle.backbutton]}
          >
            <ChevronLeft size={26} color={'rgb(255, 255, 255)'} />
          </View>
        </TouchableOpacity>

        <View>
          <Text
            style={{
              fontFamily: "SF Pro",
              fontWeight: "600",
              fontSize: 18,
              lineHeight: 28,
              color: 'rgba(255, 255, 255, 0.9)'
            }}
          >
            {selectedCategory?.name}
          </Text>
        </View>
      </View>

      {subGenres.length > 0
        ? (
          <Animated.ScrollView
            onScroll={onScroll}
            bounces={false}
            nestedScrollEnabled={true}
            contentContainerStyle={{
              paddingBottom: 250,
              paddingTop: insets.top + 56
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
          </Animated.ScrollView>
        )
        : (
          <Animated.FlatList
            data={categoryTopPodcasts}
            keyExtractor={(item) => item.id.toString()}
            renderItem={(({ item }) => <PodcastCard item={item} tab='search' />)}
            numColumns={2}
            onScroll={onScroll}
            contentContainerStyle={{
              paddingHorizontal: 22,
              paddingTop: insets.top + 48 + 24,
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
    //eslint-disable-next-line
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