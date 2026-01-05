import { View, Text, ScrollView, FlatList } from 'react-native'
import React from 'react'
import Header from '@/components/Header';
import { episode, subscribed } from '../../constants/podcasts';
import EpisodeCard from '@/components/EpisodeCard';
import {filter} from '../../constants/filter';

const Podcasts = () => {
  return (
    <ScrollView>
      {/* Top section */}

      <View>
        <Header screen='podcast' />

        <FlatList
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          data={subscribed}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            return (
              <View
                style={{
                  flexDirection: "column",
                  gap: 2,
                  flexWrap: 'wrap',
                  paddingHorizontal: 6,
                  height: 90,
                  alignItems: 'center'
                }}
              >
                <View
                  style={{
                    height: 56,
                    width: 56,
                    borderRadius: 112,
                    backgroundColor: 'grey'
                  }}
                ></View>

                <Text
                  numberOfLines={1}
                  ellipsizeMode='tail'
                  style={{
                    fontFamily: "SF Pro",
                    fontSize: 12,
                    fontWeight: '500',
                    lineHeight: 16,
                    width: 56,
                    textAlign: 'center'
                  }}
                >
                  {item.title}
                </Text>
              </View>
            )
          }}
          style={{
            paddingLeft: 20
          }}
        />
        <FlatList
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          data={filter}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            return (
              <View
                style={{
                  paddingHorizontal: 10,
                  paddingVertical: 6,
                  borderRadius: 8,
                  backgroundColor: 'rgba(0, 0, 0, 0.14)'
                }}
              >
                <Text
                  style={{
                    fontFamily: "SF Pro",
                    fontSize: 14,
                    fontWeight: 500,
                    lineHeight: 16,
                    color: 'white'
                  }}
                >
                  {item.category}
                </Text>
              </View>
            )
          }}
          contentContainerStyle={{
            flexDirection: 'row',
            gap: 8,
            paddingLeft: 20,
            paddingVertical: 6,
          }}
          style={{
            height: 40,
            marginBottom: 12,
            flexGrow: 0,
            flexShrink: 0
          }}
        />
      </View>

      <FlatList 
        scrollEnabled= {false}
        data={episode}
        keyExtractor={(item) => item.id}
        renderItem={({item}) => <EpisodeCard data={item} />}
      />

    </ScrollView>
  )
}

export default Podcasts;