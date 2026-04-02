
import { useRouter } from 'expo-router';
import { TouchableOpacity, View, Text, Pressable, Dimensions } from 'react-native';
import { Podcast } from '@/store/usePodcastStore';
import { Image } from 'expo-image';
import React from 'react';
import useModalStore from '@/store/useModalStore';
import { EllipsisVertical } from 'lucide-react-native';

const PodcastCard: React.FC<{podcast: Podcast}> = ({podcast}) => {
  const router = useRouter();
  const { openGlobalModal, setTappedPodcast } = useModalStore();

  const width = Dimensions.get("screen").width

  return (
    <TouchableOpacity
      onPress={() => router.navigate({
        pathname: "/(tabs)/(home)/podcast/[id]",
        params: { id: `${podcast.id}` }
      })}
      key={podcast.id}
      style={{
        flexDirection: 'row',
        gap: 12,
        flexGrow: 0,
        flexShrink: 0,
        alignItems: 'center',
        width: width,
        justifyContent: 'space-between',
        height: 72,
        paddingHorizontal: 16
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
            height: 56,
            width: 56,
            borderRadius: 4,
          }}
        >
          <Image
            source={{ uri: podcast.thumbnail }}
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
            {podcast.artist}
          </Text>
        </View>
      </View>

      {/* more icon */}
      <Pressable
        onPress={() => {
          openGlobalModal('podcast');
          setTappedPodcast(podcast);
        }}
        style={{
          height: 30,
          width: 30,
          borderRadius: 60,
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <EllipsisVertical size={20} />
      </Pressable>
    </TouchableOpacity>
  )
};

export default PodcastCard;