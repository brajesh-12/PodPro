import { View, Text, Pressable } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSpring } from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useEffect, useState } from 'react';
import { scheduleOnRN } from 'react-native-worklets';
import useModalStore from '@/store/useModalStore';
import { style } from './CustomModal';
import { Delete, Edit, ClosedCaptionIcon } from 'lucide-react-native';
import usePlaylistStore from '@/store/usePlaylistStore';
import API from '@/services/api';

const PlaylistBottomSheet = () => {
  const translateY = useSharedValue(0);
  const current = useSharedValue(0);
  
  const sheetHeight = 236;

  const { playlistOpen, closePlaylistOptions, tappedPlaylist } = useModalStore();
  const { fetchPlaylists } = usePlaylistStore();

  useEffect(() => {
    if (playlistOpen) {
      translateY.value = withSpring(0, { damping: 20, stiffness: 200, overshootClamping: true })
    }
    else {
      translateY.value = withTiming(sheetHeight, { duration: 300 });
    }
    // eslint-disable-next-line
  }, [playlistOpen]);

  const handleClose = () => {
    translateY.value = withTiming(sheetHeight, {duration: 300}, () => {
      scheduleOnRN(closePlaylistOptions)
    });
  };

  const pan = Gesture.Pan()
    .onBegin(() => {
      current.value = translateY.value
    })
    .onUpdate((event) => {
      translateY.value = Math.max(0, current.value + event.translationY);
    })
    .onEnd((event) => {
      if (translateY.value > sheetHeight * 0.3 || event.velocityY > 800) {
        translateY.value = withTiming(sheetHeight, { duration: 300 }, () => {
          scheduleOnRN(closePlaylistOptions)
        });
      }
      else {
        translateY.value = withTiming(0, { duration: 300 })
      }
    })

  const bottomSheetStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }]
    };
  });

  const handleDelete = async() => {
    if(tappedPlaylist) {
      await API.deletePlaylist(tappedPlaylist?.id);
      fetchPlaylists();
    };
    handleClose();
  };

  if (!playlistOpen) return;

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "flex-end",
        position: "absolute",
        right: 0,
        left: 0,
        top: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.4)",
        zIndex: 900
      }}
    >
      <GestureDetector
        gesture={pan}
      >
        <Animated.View
          style={[{
            width: "100%",
            backgroundColor: "white",
            borderTopLeftRadius: 36,
            borderTopRightRadius: 36,
            overflow: "hidden",
            paddingHorizontal: 20,
            paddingBottom: 32
          }, bottomSheetStyle]}
        >
          <Pressable
            onPress={() => {
              handleClose();
            }}
            style={{
              position: "absolute",
              top: 12,
              right: 12,
              height: 44,
              width: 44,
              backgroundColor: "white",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 24,
              zIndex: 12,
              shadowOffset: {
                height: 4,
                width: -3
              },
              shadowColor: "rgb(0, 0, 0)",
              shadowOpacity: 0.18,
              shadowRadius: 8,

              elevation: 5
            }}
          >
            {/* <Cross size={22} strokeWidth={1.2}/> */}
            <ClosedCaptionIcon size={20} strokeWidth={1.2} />
          </Pressable>

          <View
            style={{
              height: 12,
              width: "100%",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <View
              style={{
                height: 5,
                width: 36,
                borderRadius: 32,
                backgroundColor: "rgb(137, 137, 137)"
              }}
            />
          </View>

          <View
            style={{
              marginBottom: 16,
              paddingHorizontal: 4,
              justifyContent: "center",
              // backgroundColor: "yellow"
            }}
          >
            <View
              style={{
                justifyContent: "center",
                borderBottomWidth: 1,
                borderBottomColor: "rgb(221, 221, 221)",
                paddingVertical: 12,
                paddingRight: 32,
                paddingLeft: 4
              }}
            >
              <Text
                numberOfLines={1}
                style={{
                  fontFamily: "SF Pro",
                  fontSize: 24,
                  fontWeight: "600",
                  lineHeight: 32
                }}
              >
                {tappedPlaylist?.title}
                {/* Episode Title long long long */}
              </Text>
            </View>

          </View>

          {/* options */}
          <View
            style={{
              backgroundColor: 'rgb(236, 236, 236)',
              borderRadius: 26,
              marginTop: 12
            }}
          >

            <Pressable
              style={[style.optionContainer]}
            >
              {/* icon */}
              <View
                style={style.iconContainer}
              >
                <Edit size={22} strokeWidth={1.8} />
              </View>

              {/* text */}
              <View
                style={[style.textContainer]}
              >
                <Text
                  numberOfLines={1}
                  style={style.text}
                >
                  Edit
                </Text>
              </View>
            </Pressable>

            <Pressable
              onPress={handleDelete}
              style={[style.optionContainer]}
            >
              {/* icon */}
              <View
                style={style.iconContainer}
              >
                <Delete size={22} strokeWidth={1.8} />
              </View>

              {/* text */}
              <View
                style={[style.textContainer]}
              >
                <Text
                  numberOfLines={1}
                  style={style.text}
                >
                  Delete
                </Text>
              </View>
            </Pressable>


          </View>
        </Animated.View>
      </GestureDetector>

    </View>
  );
};

export default PlaylistBottomSheet;