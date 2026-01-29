import usePlayerStore from '@/store/usePlayerStore';
import { Image } from 'expo-image';
import { Play, Pause } from 'lucide-react-native';
import { View, Text, TouchableOpacity, Pressable } from 'react-native'

const MiniPlayer = () => {
  const { activeEpisode, minimizedPlayer, isPlaying, togglePlay } = usePlayerStore();

  if (!activeEpisode) return null;

  return (
    <TouchableOpacity
      onPress={() => minimizedPlayer(false)}
      style={{
        height: 64,
        position: "absolute",
        bottom: 80,
        right: 0,
        left: 0,
        backgroundColor: "white",
      }}
    >
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 20
        }}
      >
        <View
          style={{
            flexDirection: "row",
            gap: 12,
            alignItems: "center"
          }}
        >
          <View
            style={{
              height: 48,
              width: 48
            }}
          >
            <Image
              source={{ uri: activeEpisode.image }}
              style={{
                height: "100%",
                width: "100%",
                borderRadius: 2
              }}
              contentFit="cover"
            />
          </View>

          <View
            style={{
              flexDirection: "column",
              width: 255
            }}
          >
            <Text
              numberOfLines={1}
              ellipsizeMode='tail'
              style={{
                fontFamily: "SF Pro",
                fontSize: 14,
                fontWeight: "500",
                lineHeight: 20,
                width: 255
              }}
            >
              {activeEpisode.title}
            </Text>

            <Text
              numberOfLines={1}
              ellipsizeMode='tail'
              style={{
                fontFamily: "SF Pro",
                fontSize: 14,
                fontWeight: "400",
                lineHeight: 20
              }}
            >
              {activeEpisode.podcastTitle}
            </Text>
          </View>
        </View>

        <Pressable
          onPress={() => togglePlay()}
        >
          {isPlaying ? (
            <Pause size={22} strokeWidth={0} fill={'black'} />
          ) : (
            <Play size={22} fill={'black'} />
          )}
        </Pressable>
      </View>

    </TouchableOpacity>
  )
}

export default MiniPlayer;