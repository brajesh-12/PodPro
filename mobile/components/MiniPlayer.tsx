import usePlayerStore from '@/store/usePlayerStore';
import { Image } from 'expo-image';
import { Play, Pause } from 'lucide-react-native';
import { View, Text, Pressable } from 'react-native';
import Slider from './Slider';

const MiniPlayer = () => {
  const { activeEpisode, minimizedPlayer, isPlaying, togglePlay } = usePlayerStore();

  if (!activeEpisode) return null;

  return (
    <Pressable
      onPress={() => minimizedPlayer(false)}
      style={{
        position: "absolute",
        bottom: 104,
        right: 16,
        left: 16,
        backgroundColor: "white",
        borderRadius: 12
      }}
    >
      {/* Info section */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 12,
          paddingVertical: 8,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            gap: 12,
            alignItems: "center"
          }}
        >
          {/* cover */}
          <View
            style={{
              height: 48,
              width: 48,
            }}
          >
            <Image
              source={{ uri: activeEpisode.image }}
              style={{
                height: "100%",
                width: "100%",
                borderRadius: 4
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

      {/* Slider */}
      <Slider width={293} />

    </Pressable>
  );
};

export default MiniPlayer;