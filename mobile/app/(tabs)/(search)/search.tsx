import { View, Text, TouchableOpacity, TextInput, Pressable, FlatList, StyleSheet } from 'react-native';
import { EllipsisVertical, X, Search, ChevronLeft } from 'lucide-react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import useSearchStore from '@/store/useSearchStore';
import { searchPodcast } from '@/services/podcastAPI';
import useDebounce from '@/hooks/useDebounce';
import useModalStore from '@/store/useModalStore';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaskedView from '@react-native-masked-view/masked-view';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

const SearchScreen = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const { setResults, results, searchQuery, setSearchQuery, resetSearch } = useSearchStore();
  const { setTappedPodcast, openModal } = useModalStore();

  // const [ searchQuery, setSearchQuery ] = useState("");
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
        flex: 1,
        paddingTop: insets.top,
        backgroundColor: "rgb(11, 11, 11)"
      }}
    >
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
            backgroundColor: 'rgba(0, 0, 0, 0.6)'
          }}
        />
      </MaskedView>

      {/* Search Bar */}
      <View
        style={{
          position: "absolute",
          top: insets.top,
          right: 0,
          left: 0,
          flexDirection: "row",
          height: 48,
          paddingHorizontal: 16,
          gap: 8,
          alignItems: "center",
          marginBottom: 12,
          marginTop: 12,
          zIndex: 50
        }}
      >
        <TouchableOpacity
          onPress={() => {
            resetSearch();
            router.back();
          }}
          style={{
            height: 48,
            width: 48,
            backgroundColor: "rgb()",
            borderRadius: 100,
            shadowOpacity: 0.12,
            shadowOffset: {
              height: 2,
              width: 1,
            },
            shadowRadius: 8,
            overflow: "hidden"
          }}
        >
          <BlurView
            intensity={32}
            style={{
              flex: 1,
              paddingLeft: 8,
              justifyContent: 'center',
              backgroundColor: "rgba(11, 11, 11, 0.4)",
            }}
          >
            <ChevronLeft size={28} color={'rgb(255, 255, 255)'} />
          </BlurView>
        </TouchableOpacity>

        <BlurView
          intensity={22}
          style={{
            flexDirection: "row",
            gap: 4,
            alignItems: "center",
            flex: 1,
            height: 48,
            backgroundColor: "rgba(11, 11, 11, 0.4)",
            borderRadius: 32,
            paddingHorizontal: 12,
            overflow: "hidden"
          }}
        >
          <Search size={22} strokeWidth={1.8} color={'rgba(255, 255, 255, 0.8)'} />
          <TextInput
            placeholder='Search Podcast'
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={{
              flex: 1,
              height: 36,
              fontFamily: "SF Pro",
              fontSize: 16,
              fontWeight: "400",
              color: 'rgb(255, 255, 255)',
            }}
            placeholderTextColor={"rgba(255, 255, 255, 0.6)"}
            keyboardAppearance="default"
            keyboardType="ascii-capable"
            autoFocus={true}
          />
          {
            searchQuery.trim().length > 0 && (
              <Pressable
                onPress={() => setSearchQuery("")}
              >
                <X size={16} color={'rgba(255, 255, 255, 0.8)'} />
              </Pressable>
            )
          }

        </BlurView>

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
                pathname: "/(tabs)/(search)/podcast/[id]",
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
                }}
              >
                <Image
                  source={{
                    uri: item.thumbnail
                  }}
                  style={{
                    height: "100%",
                    width: "100%",
                    borderRadius: 6
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
                    width: 249,
                    color: "rgba(255, 255, 255, 0.9)"
                  }}
                >
                  {item.title}
                </Text>
                <Text
                  numberOfLines={1}
                  ellipsizeMode='tail'
                  style={{
                    width: 249,
                    color: "rgba(255, 255, 255, 0.6)"
                  }}
                >
                  {item.artist}
                </Text>
              </View>
            </View>

            <Pressable
              onPress={() => {
                setTappedPodcast(item);
                openModal('podcast');
              }}
              style={{
                height: 30,
                width: 30
              }}
            >
              <EllipsisVertical size={20} color={'rgba(255, 255, 255, 0.8)'} />
            </Pressable>
          </Pressable>
        )}
        bounces={false}
        contentContainerStyle={{
          paddingTop: insets.top + 32
        }}
      />
    </View>
  )
}

export default SearchScreen;