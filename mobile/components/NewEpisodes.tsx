import { View, Text, Pressable, FlatList } from 'react-native'
import React from 'react'
import { ChevronRight } from 'lucide-react-native';
import useSubscriptionStore from '@/store/useSubscriptionStore';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import usePlayerStore from '@/store/usePlayerStore';
import useModalStore from '@/store/useModalStore';
import { NewEpisodesSkeleton } from './SkeletonLoader';

const NewEpisodes = () => {
  const { feed, isFetching } = useSubscriptionStore();
  const { setActiveEpisode } = usePlayerStore();
  const { openModal, setTappedEpisode, setPodcastId } = useModalStore();

  const { followingPodcasts } = useSubscriptionStore();

  const newEpisodes = feed.slice(0, 8);

  const router = useRouter();

  if (feed.length === 0) return;

  return (
    <View>
      {isFetching
        ? (
          <NewEpisodesSkeleton />
        )
        : (
          <View>
            {/* title */}
            <Pressable
              onPress={() => {
                router.navigate({
                  pathname: "/(tabs)/(podcast)"
                });
              }}
              style={{
                flexDirection: "row",
                alignItems: "center",
                height: 28,
                marginBottom: 12,
                paddingLeft: 20
              }}
            >
              <Text
                style={{
                  fontFamily: "SF Pro",
                  fontWeight: "700",
                  fontSize: 18,
                  lineHeight: 28
                }}
              >
                New Episodes
              </Text>

              <View>
                <ChevronRight size={22} strokeWidth={1.8} />
              </View>
            </Pressable>

            <FlatList
              data={newEpisodes}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.id}
              bounces={false}
              renderItem={({ item }) => {

                const findPodcastId = () => {
                  const podcast = followingPodcasts.find((pod) => pod.podcastId === item.podcastId);
                  if (podcast) {
                    return podcast.id;
                  };

                  return null;
                };
                const podId = findPodcastId();

                return (
                  <Pressable
                    onPress={() => {
                      setActiveEpisode(item);
                    }}
                    onLongPress={() => {
                      openModal("episode");
                      setPodcastId(podId);
                      setTappedEpisode(item);
                    }}
                    style={{
                      marginRight: 16
                    }}
                  >
                    <View
                      style={{
                        height: 240,
                        width: 240,
                      }}
                    >
                      <Image
                        source={{ uri: item.image }}
                        style={{
                          height: "100%",
                          width: "100%",
                          borderRadius: 12
                        }}
                        contentFit="contain"
                      />
                    </View>

                    <View
                      style={{
                        marginTop: 12,
                        width: 230
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: "SF Pro",
                          fontSize: 14,
                          fontWeight: "500",
                          lineHeight: 20,
                          color: "black",
                          // width: 220
                        }}
                        numberOfLines={1}
                        ellipsizeMode='tail'
                      >
                        {item.title}
                      </Text>

                      <Text
                        numberOfLines={1}
                        ellipsizeMode='tail'
                        style={{
                          fontFamily: "SF Pro",
                          fontSize: 14,
                          fontWeight: "500",
                          lineHeight: 20,
                          color: "grey",
                          // width: 220
                        }}
                      >
                        {item.podcastTitle}
                      </Text>
                    </View>
                  </Pressable>
                )
              }}
              style={{
                paddingLeft: 20
              }}
            />
          </View>
        )
      }

    </View>
  )
}

export default NewEpisodes;