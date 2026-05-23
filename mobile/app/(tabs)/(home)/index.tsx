import { View, Text, FlatList, Pressable, TouchableOpacity } from 'react-native';
import Trending from '@/components/Trending';
import Section from '@/components/Section';
import { usePodcastStore } from '@/store/usePodcastStore';
import { useEffect, useState } from 'react';
import { useNetworkStore } from '@/store/useNetworkStore';
import { categories } from '@/services/podcastAPI';
import PodcastCard from '@/components/PodcastCard';
import Animated, { useSharedValue, useAnimatedScrollHandler, clamp, useAnimatedStyle } from 'react-native-reanimated';
import { Bell } from '@/Icons-assets/Icon';
import { Cast, Search } from 'lucide-react-native';
// import { useRouter } from 'expo-router';
// import { useSafeAreaInsets } from "react-native-safe-area-context";
import useSearchStore from '@/store/useSearchStore';
import NewEpisodes from '@/components/NewEpisodes';
// import useModalStore from '@/store/useModalStore';

const HEADER_HEIGHT = 90;

const AnimatedHeader = ({ selectedCategory, handleFilter, style, setHeight }: { selectedCategory: any, handleFilter: any, style: any, setHeight: (height: any) => void }) => {
  // const router = useRouter();
  const { setSearching } = useSearchStore();
  // const { setCustomModal } = useModalStore();

  return (
    <Animated.View
      onLayout={(event) => {
        const { height } = event.nativeEvent.layout;
        setHeight(height);
      }}
      style={[{
        position: "absolute",
        zIndex: 30,
        backgroundColor: 'rgb(242, 242, 242)',
      }, style]}
    >
      <View
        style={{
          height: 48,
          flexDirection: 'row',
          paddingLeft: 20,
          paddingRight: 12,
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 0,
          width: "100%"
        }}
      >
        {/* left container */}
        <View>
          <Text
            style={{
              fontFamily: "SF Pro",
              fontSize: 24,
              fontWeight: "800",
            }}
          >
            PodPro
          </Text>
        </View>

        {/* right container */}
        <View
          style={{
            flexDirection: 'row',
            gap: 2
          }}
        >
          <Pressable
            style={{
              height: 36,
              width: 36,
              borderRadius: 72,
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Cast size={22} strokeWidth={2} />
          </Pressable>

          <View
            style={{
              height: 36,
              width: 36,
              borderRadius: 72,
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Bell size={22} strokeWidth={2} />
          </View>

          <TouchableOpacity
            onPress={() => {
              setSearching();
            }}
            style={{
              height: 36,
              width: 36,
              borderRadius: 72,
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Search size={22} strokeWidth={2} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Fitlers */}
      <FlatList
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        data={categories}
        keyExtractor={(item) => item.code}
        renderItem={({ item }) => {
          const isSelected = selectedCategory === item.name;
          return (
            <Pressable
              onPress={() => handleFilter(item.name, item.code)}
              style={{
                paddingHorizontal: 10,
                paddingVertical: 6,
                borderRadius: 8,
                backgroundColor: !isSelected ? 'rgba(0, 0, 0, 0.14)' : 'rgb(0, 0, 0)'
              }}
            >
              <Text
                style={{
                  fontFamily: "SF Pro",
                  fontSize: 14,
                  fontWeight: 500,
                  lineHeight: 16,
                  color: 'white'
                }}
              >
                {item.name}
              </Text>
            </Pressable>
          )
        }}
        contentContainerStyle={{
          flexDirection: 'row',
          gap: 8,
          paddingLeft: 20,
          paddingVertical: 6,
        }}
      />
    </Animated.View>
  );
};

const HomeScreen = () => {
  // const insets = useSafeAreaInsets();
  const { history, trending, fetchData, science, comedy, education, fetchFilterResult, filterResult } = usePodcastStore();
  const { isOnline } = useNetworkStore();

  const [headerHeight, setHeaderHeight] = useState(0);

  const [selectedCategory, setSelectedCategory] = useState("All");
  const historyPods = history.slice(0, 10);
  const topTenResult = filterResult.slice(0, 10);
  const remainingResult = filterResult.slice(11, 20);

  const handleFilter = async (category: string, code: string) => {
    setSelectedCategory(category);
    fetchFilterResult(code);
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const translateY = useSharedValue(0);
  const lastScrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      const currentScrollY = event.contentOffset.y;
      const diff = currentScrollY - lastScrollY.value;

      if (currentScrollY <= 0) {
        translateY.value = 0;
      } else {
        translateY.value = clamp(translateY.value - diff, -HEADER_HEIGHT, 0);
      }

      lastScrollY.value = currentScrollY;
    }
  });

  const headerStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }]
  }));

  if (!isOnline) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <Text>
          No Internet, Check downloads.
        </Text>
      </View>
    )
  };

  return (
    <View>
      {/* <Header screen='home' /> */}
      <AnimatedHeader selectedCategory={selectedCategory} handleFilter={handleFilter} style={headerStyle}
        setHeight={setHeaderHeight}
      />

      <Animated.ScrollView
        style={{
          paddingTop: headerHeight + 8,
        }}
        onScroll={scrollHandler}
        bounces={false}
        overScrollMode={"never"}
        showsVerticalScrollIndicator={false}
      >
        {selectedCategory !== "All"
          ? (
            <View>
              <Section title={`Most Popular in ${selectedCategory}`} data={topTenResult} />

              <View>
                {remainingResult.map((item) => (
                  <View key={item.id}>
                    <PodcastCard podcast={item} />
                  </View>
                ))}
              </View>
            </View>
          )
          : (
            <>
              <NewEpisodes />

              <Trending data={trending} />
              <Section title={'History'} data={historyPods} />
              <Section title={'Comedy'} data={comedy} />
              <Section title={'Education'} data={education} />
              <Section title={'Science'} data={science} />
            </>
          )
        }
      </Animated.ScrollView>

    </View>

  )
}

export default HomeScreen;