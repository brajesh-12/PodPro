import { View, Text, Pressable, FlatList, TouchableOpacity, Dimensions, StyleSheet } from 'react-native';
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

const { width: SCREEN_WIDTH } = Dimensions.get("screen");

const SearchIndex = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "black"
      }}
    >
      {/* top blur */}
      <MaskedView
        style={{
          position: "absolute",
          right: 0,
          left: 0,
          top: 0,
          height: 150,
          zIndex: 10
        }}
        maskElement={
          <LinearGradient
            style={StyleSheet.absoluteFill}
            colors={['rgba(0, 0, 0, 1)', 'rgba(0, 0, 0, 0)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
          />}
      >
        <BlurView
          intensity={30}
          tint="light"
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            left: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.2)'
          }}
        />
      </MaskedView>

      {/* Search Bar */}
      <Pressable
        onPress={() =>
          router.navigate({
            pathname: "/(tabs)/(search)/search"
          })
        }
        style={{
          position: "absolute",
          top: insets.top + 12,
          height: 48,
          width: SCREEN_WIDTH - 40,
          flexDirection: 'row',
          alignItems: "center",
          gap: 8,
          backgroundColor: 'rgb(218, 218, 218)',
          marginHorizontal: 16,
          paddingHorizontal: 12,
          borderRadius: 32,
          zIndex: 50
        }}
      >
        <View>
          <Search size={22} strokeWidth={1.8} />
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
              color: "grey"
            }}
          >
            Search Podcast
          </Text>
        </View>
      </Pressable>

      {/* Categories */}
      <FlatList
        data={categories}
        bounces={false}
        keyExtractor={(item) => item.code}
        renderItem={({ item }) => <GenreCard item={item} />}
        numColumns={2}
        ListHeaderComponentStyle={{
          marginBottom: 8
        }}
        style={{
          paddingHorizontal: 20,
          paddingTop: 20,
        }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: 48 + 16 + insets.top,
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
          pathname: "/(tabs)/(search)/category"
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