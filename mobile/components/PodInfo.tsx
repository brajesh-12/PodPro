import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { Image } from 'expo-image';
import { usePodcastStore } from '@/store/usePodcastStore';
import { Settings, Share2, Star } from 'lucide-react-native';
import useSubscriptionStore from '@/store/useSubscriptionStore';

const PodInfo = () => {
  const {podcast} = usePodcastStore();
  const { toggleSubscription, subscriptionIds } = useSubscriptionStore();

  const isSubscribed = podcast?.id !== undefined ? subscriptionIds.has(podcast?.id) : false;

  if(!podcast) {
    return <View><Text>Loading...</Text></View>
  }

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
            source={{uri: podcast.thumbnail}}
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
        {/* rating tag */}
        <View
          style={{
            width: 74,
            flexDirection: "row",
            gap: 4,
            paddingHorizontal: 6,
            paddingVertical: 4,
            backgroundColor: "rgb(217, 217, 217)",
            borderRadius: 4
          }}
        >
          <Star size={16} fill={"black"} strokeWidth={0}/>

          <Text
            style={{
              fontFamily: "SF Pro",
              fontSize: 12,
              fontWeight: "400",
              lineHeight: 16
            }}
          >
            4.5(2k)
          </Text>
        </View>

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
              textAlign: "center"
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
              color: "grey"
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
          justifyContent: "space-between",
          paddingHorizontal: 50.5,
          marginBottom: 24
        }}
      >
        <View
          style={{
            height: 44,
            width: 44,
            borderRadius: 88,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgb(217, 217, 217)"
          }}
        >
          <Settings size={22} strokeWidth={2}/>
        </View>

        {/* Button */}
        <TouchableOpacity
          onPress={() => toggleSubscription(podcast.id)}
          style={{
            height: 44,
            width: 172,
            borderRadius: 88,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "black",
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

        </TouchableOpacity>

        <View
          style={{
            height: 44,
            width: 44,
            borderRadius: 88,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgb(217, 217, 217)"
          }}
        >
          <Share2 size={22} strokeWidth={2}/>
        </View>
      </View>

      {/* Tailer Part */}
    </View>
  )
}

export default PodInfo;