import { View, Text, Pressable, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';
import { useRouter } from 'expo-router';
import { Search } from 'lucide-react-native';
import { Image } from 'expo-image';
import categories from '@/constants/categories';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useSearchStore from '@/store/useSearchStore';
import MaskedView from '@react-native-masked-view/masked-view';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { createAnimatedComponent, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';

const AnimatedMaskedView = createAnimatedComponent(MaskedView);

const SearchIndex = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const scrollY = useSharedValue(0);

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    }
  });

  const blurStyle = useAnimatedStyle(() => {
    const opacity = scrollY.value > 18 ? 1 : 0;
    return {opacity};
  });

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "rgb(11, 11, 11)"
      }}
    >
      {/* top blur */}
      <AnimatedMaskedView
        style={[{
          position: "absolute",
          right: 0,
          left: 0,
          top: 0,
          height: 140,
          zIndex: 10,
        }, blurStyle]}
        maskElement={
          <LinearGradient
            style={StyleSheet.absoluteFill}
            colors={['rgba(0, 0, 0, 1)', 'rgba(0, 0, 0, 0)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
          />}
      >
        <BlurView
          intensity={200}
          tint="dark"
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            left: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)'
          }}
        />
      </AnimatedMaskedView>

      {/* Categories */}
      <Animated.FlatList
        onScroll={onScroll}
        data={categories}
        bounces={false}
        keyExtractor={(item) => item.code}
        ListHeaderComponent={
          < Pressable
            onPress={() =>
              router.navigate({
                pathname: "/(tabs)/(search)/search"
              })
            }
            style={{
              height: 48,
              // paddingHorizontal: 16,
              zIndex: 50,
              borderRadius: 32,
              overflow: "hidden",
              shadowColor: "rgb(255, 255, 255)",
              shadowOpacity: 0.15,
              shadowRadius: 6,
              shadowOffset: {
                height: 2,
                width: 2
              },
              marginBottom: 16,
              flexDirection: 'row',
              alignItems: "center",
              gap: 8,
              paddingHorizontal: 12,
              backgroundColor: "rgba(255, 255, 255, 0.09)",
              borderWidth: 0.8,
              borderColor: "rgba(255, 255, 255, 0.15)"
            }}
          >
            <View>
              <Search size={22} strokeWidth={1.8} color={'rgba(255, 255, 255, 0.6)'} />
            </View>

            <View
              style={{
                height: "100%",
                width: "auto",
                justifyContent: "center"
              }}
            >
              <Text
                style={{
                  fontFamily: "SF Pro",
                  fontSize: 16,
                  fontWeight: "500",
                  lineHeight: 24,
                  color: "rgba(255, 255, 255, 0.8)"
                }}
              >
                Search Podcast
              </Text>
            </View>
          </Pressable>
        }
        renderItem={({ item }) => <GenreCard item={item} />}
        numColumns={2}
        ListHeaderComponentStyle={{
          marginBottom: 8
        }}
        style={{
          paddingHorizontal: 20,
          paddingTop: 12,
        }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: insets.top,
          gap: 10,
          paddingBottom: 250,
        }}
        columnWrapperStyle={{
          justifyContent: "space-between",
          gap: 10
        }}
      />
    </View>
  );
};

const GenreCard = ({ item }: { item: any }) => {
  const router = useRouter();
  const { setSelectedCategory } = useSearchStore();

  return (
    <TouchableOpacity
      onPress={() => {
        setSelectedCategory(item);
        router.navigate({
          pathname: "/(tabs)/(search)/Category"
        });
      }}
      style={{
        height: 98,
        flex: 1,
        backgroundColor: "grey",
        borderRadius: 12,
      }}
    >
      <Image
        style={{
          height: "100%",
          width: "100%"
        }}
        source={item.image}
      />
    </TouchableOpacity>
  );
};

export default SearchIndex;