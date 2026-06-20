import { View, Text, Pressable, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import React from 'react';
import { useRouter } from 'expo-router';
import { Search } from 'lucide-react-native';
import { Image } from 'expo-image';
import categories from '@/constants/categories';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useSearchStore from '@/store/useSearchStore';

const { width: SCREEN_WIDTH } = Dimensions.get("screen"); 

const SearchIndex = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        paddingTop: insets.top
      }}
    >
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
          paddingTop: 48 + 16,
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