import { View, Text, Modal, TouchableOpacity, Pressable } from 'react-native';
import usePlayerStore from '@/store/usePlayerStore';
import SafeArea from './SafeArea';
import { ChevronDown, EllipsisVertical, Pause, Play } from 'lucide-react-native';
import { Image } from 'expo-image';
import Slider from '../components/Slider';
import { Backward, Forward, SleepTimer, SpeedControl } from '@/Icons-assets/Icon';

const FullPlayer = () => {
  const { minimized, activeEpisode, minimizedPlayer, isPlaying, togglePlay } = usePlayerStore();

  if ( minimized || !activeEpisode ) return null;
  return (
    <Modal
      visible={!minimized} animationType="slide"
    >
      <SafeArea
        backgroundColor='none'
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            height: 48,
            paddingLeft: 12,
            paddingRight: 8
          }}
        >
          <TouchableOpacity
            onPress={() => minimizedPlayer(true)}
            style={{
              alignItems: "center",
              justifyContent: "center",
              height: 36,
              width: 36,
              borderRadius: 72
            }}
          >
            <ChevronDown size={24} strokeWidth={2} />
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              alignItems: "center",
              justifyContent: "center",
              height: 36,
              width: 36,
              borderRadius: 72
            }}
          >
            <EllipsisVertical size={24} strokeWidth={2} />
          </TouchableOpacity>
        </View>

        {/* Thumbnail and title */}
        <View
          style={{
            paddingHorizontal: 20,
            paddingTop: 40,
            flexDirection: "column",
            gap: 36,
            marginBottom: 24
          }}
        >
          <View
            style={{
              height: 353,
              width: 353,
            }}
          >
            <Image
              source={{uri: activeEpisode.image}}
              style={{
                height: "100%",
                width: "100%",
                borderRadius: 12
              }}
            />
          </View>

          <View
            style={{
              flexDirection: "column",
              gap: 4,
            }}
          >
            <Text
              numberOfLines={1}
              ellipsizeMode='tail'
              style={{
                width: 353,
                fontFamily: "SF Pro",
                fontSize: 24,
                fontWeight: "600",
                lineHeight: 32
              }}
            >
              {activeEpisode.title}
            </Text>

            <Text
              style={{
                fontFamily: "SF Pro",
                fontSize: 14,
                fontWeight: "400",
                lineHeight: 16
              }}
            >
              {activeEpisode.podcastTitle}
            </Text>
          </View>
        </View>

        <View
          style={{
            flexDirection: "column",
            alignItems: "center"
          }}
        >
          <Slider width={393}/>
        </View>

        {/* Controls */}
        <View>

          <View
            style={{
              flexDirection: "row",
              paddingHorizontal: 20,
              alignItems: "center",
              justifyContent: "space-between"
            }}
          >
            <View>
              <SpeedControl size={24}/>
            </View>

            <View
              style={{
                alignContent: 'center',
                justifyContent: 'center',
                width: 40,
                height: 40
              }}
            >
              <Backward size={32} strokeWidth={1.88}/>
            </View>

            {/* Play and Pause */}
            <Pressable
              onPress={() => togglePlay()}
              style={{
                height: 70,
                width: 70,
                borderRadius: 140,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "rgb(217, 217, 217)"
              }}
            >
              {isPlaying ? (
                  <Pause size={28} strokeWidth={2} fill={'black'}/>
                ) : (
                  <Play size={28} strokeWidth={2} fill={'black'}/>
              )}
            </Pressable>

            <View
              style={{
                alignContent: 'center',
                justifyContent: 'center',
                width: 40,
                height: 40
              }}
            >
              <Forward size={32} strokeWidth={1.88}/>
            </View>

            <View>
              <SleepTimer size={24}/>
            </View>
          </View>

          <View></View>
        </View>
      </SafeArea>
    </Modal>
  )
}

export default FullPlayer;