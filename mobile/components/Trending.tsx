import { View, Text, ScrollView } from 'react-native';
import { EllipsisVertical } from 'lucide-react-native';
import React from 'react';
import {trendings} from '../constants/podcasts';

interface Podcast {
  id: string;
  title: string;
  host: string;
}

const PodcastCard: React.FC<{podcast: Podcast}> = ({podcast}) => {
  return (
    <View
      key={podcast.id}
      style={{
        flexDirection: 'row',
        gap: 12,
        flexGrow: 0,
        flexShrink: 0,
        alignItems: 'center',
        width: 325,
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
            backgroundColor: 'grey'
          }}
        ></View>

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
            {podcast.title}
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
            {podcast.host}
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
    </View>
  )
}

const Trending = () => {

  const podcastData = trendings.slice(0, 12);

  return (
    <View>
      <View
        style={{
          paddingLeft: 20,
          marginBottom: 16
        }}
      >
        <Text
          style={{
            fontFamily: "SF Pro",
            fontSize: 18,
            fontWeight: 600,
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
            podcastData.map((item) => {
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