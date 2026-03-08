import { View, Text, Pressable } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router'

const EpisodeInfo = () => {
  const router = useRouter();

  return (
    <View>
      <Pressable
        onPress={() => {
          router.back();
        }}
      >
        <Text>
          Back
        </Text>
      </Pressable>
      <Text>EpisodeInfo</Text>
    </View>
  )
}

export default EpisodeInfo;