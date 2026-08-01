import { View, Text, TouchableOpacity, Pressable } from 'react-native'
import React, { useState } from 'react'
import { Image } from 'expo-image';
import { Podcast } from '@/store/usePodcastStore';
import { Star } from 'lucide-react-native';
import useSubscriptionStore from '@/store/useSubscriptionStore';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

const PodInfo: React.FC<{ podcast: Podcast | null, description: string | undefined }> = ({ podcast, description }) => {
  const { toggleSubscription, subscriptionIds } = useSubscriptionStore();
  const [ collapsed, setCollapsed ] = useState(true);

  const isSubscribed = podcast?.id !== undefined ? subscriptionIds.has(podcast?.id) : false;

  if (!podcast) {
    return <View><Text>Loading...</Text></View>
  }

  const genres = podcast.genres;

  return (
    <View>

      {/* Thumbnail container */}
      <View
        style={{
          height: 212,
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <View
          style={{
            height: 180,
            width: 180,
            borderRadius: 4,
            backgroundColor: "rgb(217, 217, 217)"
          }}
        >
          <Image
            source={{ uri: podcast.thumbnail }}
            style={{
              height: "100%",
              width: "100%",
              borderRadius: 4
            }}
          />
        </View>
      </View>

      {/* Second Section, text and CTA */}
      <View
        style={{
          flexDirection: "column",
          gap: 8,
          marginBottom: 24,
          alignItems: "center"
        }}
      >

        {/* Text container */}
        <View
          style={{
            flexDirection: "column",
            gap: 2,
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: 50.5
          }}
        >
          <Text
            numberOfLines={2}
            style={{
              width: 292,
              fontFamily: "SF Pro",
              fontSize: 24,
              fontWeight: "600",
              lineHeight: 32,
              textAlign: "center",
              color: "rgba(255, 255, 255, 0.9)"
            }}
          >
            {podcast.title}
          </Text>

          <Text
            style={{
              fontFamily: "SF Pro",
              fontSize: 14,
              fontWeight: "500",
              lineHeight: 16,
              color: "rgba(255, 255, 255, 0.6)"
            }}
          >
            {podcast.artist}
          </Text>
        </View>
      </View>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: 50.5,
          marginBottom: 24
        }}
      >

        {/* Button */}
        <TouchableOpacity
          onPress={() => toggleSubscription(podcast.id)}
          style={{
            height: 48,
            width: 200,
            borderRadius: 88,
            overflow: "hidden"
          }}
        >
          <BlurView
            intensity={22}
            tint='light'
            style={{
              height: '100%',
              width: '100%',
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(255, 255, 255, 0.1)",
            }}
          >
            <Text
              style={{
                fontFamily: "SF Pro",
                fontSize: 18,
                fontWeight: "500",
                lineHeight: 28,
                color: "white"
              }}
            >
              {isSubscribed
                ? "Unfollow"
                : "Follow"
              }
            </Text>
          </BlurView>
        </TouchableOpacity>
      </View>

      {/* discription and other info */}
      <View
        style={{
          paddingHorizontal: 20
        }}
      >
        <View>
          <Text
            numberOfLines={collapsed ? 2 : 0}
            ellipsizeMode='tail'
            style={{
              color: "rgba(255, 255, 255, 0.8)",
              fontFamily: "SF Pro",
              fontSize: 14,
              fontWeight: "400",
              lineHeight: 20
            }}
          >
            {description}
          </Text>

          <Pressable
            onPress={() => {
              setCollapsed(false);
            }}
            style={{
              position: "absolute",
              bottom: 0,
              right: 0,
              opacity: collapsed ? 1 : 0
            }}
          >
            <LinearGradient
              style={{
                width: 60,
              }}
              colors={["rgba(11, 11, 11, 1)", "rgba(11, 11, 11, 0)"]}
              start={{ x: 1, y: 0 }}
              end={{ x: 0, y: 0 }}
            >
              <BlurView
                intensity={2}
                tint="systemMaterialDark"
                style={{
                  width: "100%",
                  backgroundColor: "rgba(11, 11, 11, 0.2)",
                  alignItems: "flex-end"
                }}
              >
                <Text
                  style={{
                    color: "rgb(255, 255, 255)",
                    fontFamily: "SF Pro",
                    fontWeight: "500",
                    fontSize: 14
                  }}
                >
                  MORE
                </Text>
              </BlurView>
            </LinearGradient>
          </Pressable>
        </View>

        {/* Rating and genres */}

        <View
          style={{
            flexDirection: "row",
            paddingVertical: 12
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: "center"
            }}
          >
            <Star size={18} fill={'rgba(255, 255, 255, 0.9)'} />
            <Text
              style={{
                color: "rgba(255, 255, 255, 1)",
                fontFamily: "SF Pro",
                fontSize: 13,
                lineHeight: 16,
                fontWeight: "400"
              }}
            >
              4.8 (95)
            </Text>
          </View>

          {genres.map((genre) => (
            <Text key={genre}
              style={{
                color: "rgb(255, 255, 255)",
                paddingLeft: 3,
                fontFamily: "SF Pro",
                fontSize: 13,
                fontWeight: "400",
                lineHeight: 16
              }}
            >
              &middot; {genre}
            </Text>
          ))}
        </View>
      </View>

      {/* Tailer Part */}
    </View>
  )
}

export default PodInfo;