import { View, Text, FlatList, TouchableOpacity, Pressable } from 'react-native'
import { usePodcastStore } from '@/store/usePodcastStore';
import { Image } from 'expo-image';
import { ArrowDown, CirclePlay, Download, EllipsisVertical } from 'lucide-react-native';
import { formatDate, formatDuration } from '../lib/utils';
import { useRouter } from 'expo-router';
import useModalStore from '@/store/useModalStore';

const Episodes = () => {
  const router = useRouter();
  const { episodes, podcast } = usePodcastStore();
  const { setIsOpen, setType, setTappedEpisode } = useModalStore();

  return (
    <View>
      {/* Filter */}
      <View
        style={{
          flexDirection: "row",
          gap: '8',
          paddingLeft: 20,
          alignItems: "center",
          height: 44
        }}
      >
        <View
          style={{
            paddingHorizontal: 10,
            paddingVertical: 6,
            borderRadius: 6,
            backgroundColor: "black",
            flexWrap: "wrap",
            alignItems: "center"
          }}
        >
          <Text
            style={{
              fontFamily: "SF Pro",
              fontSize: 14,
              fontWeight: "500",
              lineHeight: 16,
              color: "white"
            }}
          >
            Episodes
          </Text>
        </View>

        <View
          style={{
            paddingHorizontal: 10,
            paddingVertical: 6,
            borderRadius: 6,
            backgroundColor: "rgb(217, 217, 217)",
            flexWrap: "wrap",
            alignItems: "center"
          }}
        >
          <Text
            style={{
              fontFamily: "SF Pro",
              fontSize: 14,
              fontWeight: "400",
              lineHeight: 16
            }}
          >
            More like this
          </Text>
        </View>
      </View>

      <FlatList
        scrollEnabled={false}
        data={episodes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              onPress={() => router.navigate({
                pathname: "/(tabs)/(home)/episode/[id]",
                params: { id: `${item.id}` }
              })}
              style={{
                paddingHorizontal: 20,
                paddingVertical: 16,
                borderBottomWidth: 0.8,
                borderBottomColor: 'grey',
                gap: 12
              }}
            >
              {/* first container */}
              <View
                style={{
                  flexDirection: "column",
                  gap: 8
                }}
              >
                {/* title and image */}
                <View
                  style={{
                    flexDirection: "row",
                    gap: 12,
                    alignItems: "center"
                  }}
                >
                  <View
                    style={{
                      width: 64,
                      height: 64,
                      backgroundColor: "grey",
                      borderRadius: 4
                    }}
                  >
                    <Image
                      source={{ uri: podcast?.thumbnail }}
                      style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: 4
                      }}
                      contentFit="cover"
                    />
                  </View>

                  <Text
                    numberOfLines={2}
                    ellipsizeMode='tail'
                    style={{
                      width: 237,
                      fontFamily: "SF Pro",
                      fontSize: 16,
                      fontWeight: "600",
                      lineHeight: 24
                    }}
                  >
                    {item.title}
                  </Text>

                  <Pressable
                    onPress={() => {
                      setIsOpen(true);
                      setType("episode");
                      setTappedEpisode(item);
                    }}
                  >
                    <EllipsisVertical size={20} strokeWidth={2} />
                  </Pressable>

                </View>

                <View>
                  <Text
                    numberOfLines={2}
                    ellipsizeMode='tail'
                    style={{
                      width: 353,
                      fontFamily: "SF Pro",
                      fontSize: 14,
                      lineHeight: 16,
                      fontWeight: "400"
                    }}
                  >
                    {item.description}
                  </Text>
                </View>
              </View>

              {/* second container */}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  height: 32
                }}
              >

                <View>
                  <Text
                    style={{
                      fontFamily: "SF Pro",
                      fontSize: 14,
                      fontWeight: "400",
                      lineHeight: 20
                    }}
                  >
                    {formatDate(item.publishDate)} &#xB7; {formatDuration(item.duration)}
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    gap: 16,
                    alignItems: "center"
                  }}
                >
                  <ArrowDown size={24} strokeWidth={2} />
                  <Download size={24} strokeWidth={2} />
                  <CirclePlay size={24} strokeWidth={2} />

                </View>
              </View>
            </TouchableOpacity>
          )
        }}
      />
    </View>
  )
}

export default Episodes;