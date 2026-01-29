import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { EllipsisVertical } from 'lucide-react-native';
import React from 'react';
import {Image} from 'expo-image';
import { useRouter } from 'expo-router';

const PodcastCard: React.FC<{podcast: any}> = ({podcast}) => {

  const router = useRouter();

  return (
    <TouchableOpacity
      onPress={() => router.navigate({
        pathname: "/(home)/podcast/[id]",
        params: {id: `${podcast.id}`}
      })}
      key={podcast.id}
      style={{
        flexDirection: 'row',
        gap: 12,
        flexGrow: 0,
        flexShrink: 0,
        alignItems: 'center',
        width: 343,
        justifyContent: 'space-between',
        height: 72,
        paddingLeft: 8,
        marginRight: 12
      }}
    >

      {/* left container */}
      <View
        style={{
          flexDirection: 'row',
          gap: 12,
          alignItems: 'center',
          flexGrow: 1
        }}
      >
        <View
          style={{
            height:56,
            width: 56,
            borderRadius: 4,
          }}
        >
          <Image
            source={{uri: podcast.thumbnail}}
            style={{
              height: '100%',
              width: '100%',
              borderRadius: 4
            }}
            contentFit='cover'
          />
        </View>

        {/* texts container */}
        <View
          style={{
            flexDirection: 'column',
            gap: 2
          }}
        >
          <Text
            numberOfLines={1}
            ellipsizeMode='tail'
            style={{
              fontFamily: "SF Pro",
              fontSize: 16,
              lineHeight: 24,
              fontWeight: 500,
              width: 215
            }}
          >
            {podcast.podcastTitle}
          </Text>

          <Text
            numberOfLines={1}
            ellipsizeMode='tail'
            style={{
              fontFamily: "SF Pro",
              fontSize: 14,
              fontWeight: 400,
              lineHeight: 20,
              color: 'grey',
              width: 215
            }}
          >
            {podcast.artist}
          </Text>
        </View>
      </View>

      {/* more icon */}
      <View
        style={{
          height: 30,
          width: 30,
          borderRadius: 60,
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <EllipsisVertical size={20}/>
      </View>
    </TouchableOpacity>
  )
}

const Trending = ({data}: { data: any[] }) => {

  const trendingPodcasts = data;

  return (
    <View
      style={{
        marginBottom: 12
      }}
    >
      <View
        style={{
          paddingLeft: 20,
          marginBottom: 8
        }}
      >
        <Text
          style={{
            fontFamily: "SF Pro",
            fontSize: 20,
            fontWeight: '700',
            lineHeight: 28
          }}
        >Trending</Text>
      </View>

      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{paddingLeft: 12}}
      >
        <View
          style={{
            height: 216,
            flexDirection: 'column',
            flexWrap: 'wrap',
            gap: 0
          }}
        >
          {
            trendingPodcasts.map((item) => {
              return (
                <PodcastCard podcast={item} key={item.id}/>
              )
            })
          }
        </View>
      </ScrollView>

    </View>
  )
}

export default Trending;