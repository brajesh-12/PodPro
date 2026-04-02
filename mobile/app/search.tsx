import { View, Text, TouchableOpacity, TextInput, Pressable, FlatList } from 'react-native';
import { ArrowLeft, Settings, EllipsisVertical, X } from 'lucide-react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import useSearchStore from '@/store/useSearchStore';
import { searchPodcast } from '@/services/podcastAPI';
import useDebounce from '@/hooks/useDebounce';
import useModalStore from '@/store/useModalStore';

const SearchScreen = () => {
  const router = useRouter();

  const { setResults, results } = useSearchStore();
  const { setTappedPodcast, openGlobalModal } = useModalStore();

  const [ searchQuery, setSearchQuery ] = useState("");
  const debounceQuery = useDebounce(searchQuery, 300);

  const performSearch = async (query: string) => {
    if (!query.trim()) {
      return setResults([]);
    }

    const newResult = await searchPodcast(query, 5);
    setResults(newResult);
  }

  useEffect(() => {
    try {
      performSearch(debounceQuery);
    } catch (error) {
      console.log("Error searching:", error);
    }
    // eslint-disable-next-line
  }, [debounceQuery]);

  return (
    <View
      style={{
        flex: 1
      }}
    >
      <View
        style={{
          flexDirection: "row",
          height: 48,
          width: "auto",
          paddingHorizontal: 16,
          gap: 8,
          alignItems: "center",
          marginBottom: 12
        }}
      >
        <TouchableOpacity
          onPress={() => {
            router.back();
          }}
        >
          <ArrowLeft size={24} />
        </TouchableOpacity>

        <View
          style={{
            flexDirection: "row",
            gap: 4,
            alignItems: "center",
            flexGrow: 1,
            height: 36,
            backgroundColor: "rgb(218, 218, 218)",
            borderRadius: 32,
            paddingHorizontal: 12
          }}
        >
          <TextInput
            placeholder='Search Podcast'
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={{
              flexGrow: 1,
              height: 36,
            }}
          />
          {
            searchQuery.trim().length > 0 && (
              <Pressable
                onPress={() => setSearchQuery("")}
              >
                <X size={16} />
              </Pressable>
            )
          }

        </View>

        {searchQuery.length === 0 && (
          <TouchableOpacity
            style={{
              height: 36,
              width: 36,
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Settings size={24} />
          </TouchableOpacity>
        )}

      </View>

      {/* there will be flatlist that will contain results */}
      <FlatList
        data={results}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          // Result card
          <Pressable
            onPress={() => {
              router.navigate({
                pathname: "/(tabs)/(home)/podcast/[id]",
                params: { id: `${item.id}` }
              })
            }}
            style={{
              paddingLeft: 20,
              paddingRight: 16,
              paddingBottom: 12,
              flexDirection: "row",
              gap: 12,
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            {/* Left container */}
            <View
              style={{
                flexDirection: "row",
                gap: 12
              }}
            >
              {/* image container */}
              <View
                style={{
                  height: 54,
                  width: 54,
                  borderRadius: 4
                }}
              >
                <Image
                  source={{
                    uri: item.thumbnail
                  }}
                  style={{
                    height: "100%",
                    width: "100%",
                  }}
                />
              </View>

              {/* title */}
              <View
                style={{
                  gap: 2,
                  justifyContent: "center"
                }}
              >
                <Text
                  numberOfLines={1}
                  ellipsizeMode='tail'
                  style={{
                    width: 249
                  }}
                >
                  {item.title}
                </Text>
                <Text
                  numberOfLines={1}
                  ellipsizeMode='tail'
                  style={{
                    width: 249
                  }}
                >
                  {item.artist}
                </Text>
              </View>
            </View>

            <Pressable
              onPress={() => {
                setTappedPodcast(item);
                openGlobalModal('podcast');
              }}
              style={{
                height: 30,
                width: 30
              }}
            >
              <EllipsisVertical size={20} />
            </Pressable>
          </Pressable>
        )}
      />
    </View>
  )
}

export default SearchScreen;