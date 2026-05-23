import { View, Text, Pressable, FlatList } from 'react-native'
import React from 'react'
import { ChevronRight } from 'lucide-react-native';
import useSubscriptionStore from '@/store/useSubscriptionStore';
import { Image } from 'expo-image';

const NewEpisodes = () => {
  const { feed } = useSubscriptionStore();

  return (
    <View
      style={{
        marginBottom: 32
      }}
    >
      {/* title */}
      <Pressable
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
            fontFamily:  "SF Pro",
            fontWeight: "700",
            fontSize: 18,
            lineHeight: 28
          }}
        >
          New Episodes
        </Text>

        <View>
          <ChevronRight size={22} strokeWidth={1.5}/>
        </View>
      </Pressable>

      <FlatList
        data={feed}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={({item}) => {
          return (
            <View
              style={{
                marginRight: 16
              }}
            >
              <View
                style={{
                  height: 220,
                  width: 220,
                }}
              >
                <Image
                  source={{uri: item.image}}
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
                  marginTop: 8
                }}
              >
                <Text
                  style={{
                    fontFamily: "SF Pro",
                    fontSize: 14,
                    fontWeight: "500",
                    lineHeight: 20,
                    color: "black",
                    width: 220
                  }}
                  numberOfLines={2}
                  ellipsizeMode='tail'
                >
                  {item.title}
                </Text>
                <Text
                  style={{
                    fontFamily: "SF Pro",
                    fontSize: 14,
                    fontWeight: "500",
                    lineHeight: 20,
                    color: "grey"
                  }}
                >
                  PodcastTitle
                </Text>
              </View>
            </View>
          )
        }}
        style={{
          paddingLeft: 20
        }}
      />
    </View>
  )
}

export default NewEpisodes;