import { View, Text, Pressable, FlatList } from 'react-native';
import React from 'react';
import { useRouter } from 'expo-router';
import { Search } from 'lucide-react-native';
import { Image } from 'expo-image';
import { categories } from '@/services/podcastAPI';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const SearchIndex = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const GenreCard = ({name}: {name: string}) => {
    return (
      <View
        style={{
          height: 100,
          width: 160,
          backgroundColor: "grey",
          borderRadius: 8,
        }}
      >
        <Image/>
        <View
          style={{
            position: "absolute",
            bottom: 8,
            left: 8
          }}
        >
          <Text
            style={{
              fontFamily: "SF Pro",
              fontSize: 16,
              fontWeight: "600"
            }}
          >
            {name}
          </Text>
        </View>
      </View>
    );
  };

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
          marginTop: 12,
          height: 48,
          width: 'auto',
          flexDirection: 'row',
          alignItems: "center",
          gap: 8,
          backgroundColor: 'rgb(218, 218, 218)',
          marginHorizontal: 16,
          paddingHorizontal: 12,
          borderRadius: 32
        }}
      >
        <View>
          <Search size={22} strokeWidth={1.8}/>
        </View>
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
      </Pressable>

      {/* Categories */}
      <FlatList
        data={categories}
        bounces={false}
        ListHeaderComponent={() => {
          return(
            <View
              style={{
                height: 48,
                justifyContent: "center"
              }}
            >
              <Text
                style={{
                  fontFamily: "SF Pro",
                  fontSize: 22,
                  fontWeight: "600",
                  lineHeight: 28
                }}
              >
                Genres
              </Text>
            </View>
          );
        }}
        keyExtractor={(item) => item.code}
        renderItem={({item}) => <GenreCard name={item.name}/>}
        numColumns={2}
        style={{
          paddingHorizontal: 16,
          paddingTop: 16
        }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          gap: 16
        }}
        columnWrapperStyle={{
          justifyContent: "space-between"
        }}
      />
    </View>
  );
};

export default SearchIndex;