import useModalStore from '@/store/useModalStore';
import { View, Text, Pressable, Dimensions } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming } from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useEffect } from 'react';
import { scheduleOnRN } from 'react-native-worklets';
import { Image } from 'expo-image';
import usePlaylistStore from '@/store/usePlaylistStore';
import { BlurView } from 'expo-blur';
import { CloseIcon } from '@/Icons-assets/Icon';

const { height: SCREEN_HEIGHT } = Dimensions.get("screen");
const sheetHeight = SCREEN_HEIGHT * 0.5;

const PlaylistSelection = () => {
  const { isAddTo, closePlaylistSelection, tappedEpisode, podcastId, saveToNewPlaylist } = useModalStore();
  const { addToPlaylists, addingEpisode } = usePlaylistStore();

  const context = useSharedValue(0);
  const translateY = useSharedValue(0);

  useEffect(() => {
    if (isAddTo) {
      translateY.value = withSpring(0, { damping: 20, stiffness: 250, overshootClamping: true });
    }
    else {
      translateY.value = withTiming(sheetHeight, { duration: 300 });
    }
    // eslint-disable-next-line
  }, [isAddTo]);

  const pan = Gesture.Pan()
    .onBegin(() => {
      context.value = translateY.value;
    })
    .onUpdate((event) => {
      translateY.value = Math.max(0, context.value + event.translationY);
    })
    .onEnd((event) => {
      if (translateY.value > sheetHeight * 0.3 || event.velocityY > 800) {
        translateY.value = withTiming(sheetHeight, { duration: 300 }, () => {
          scheduleOnRN(closePlaylistSelection);
        });
      }
      else {
        translateY.value = withTiming(0, { duration: 250 });
      }
    });

  const bottomSheetStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }]
    };
  });

  const handleClose = () => {
    translateY.value = withTiming(sheetHeight, { duration: 300 }, () => {
      scheduleOnRN(closePlaylistSelection);
    });
  };

  const handleNewPLaylist = () => {
    closePlaylistSelection();
    saveToNewPlaylist();
  };

  if (!isAddTo) return;
  return (
    <View
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        position: "absolute",
        right: 0,
        left: 0,
        top: 0,
        bottom: 0,
        zIndex: 995,
        justifyContent: "flex-end"
      }}
    >
      <GestureDetector
        gesture={pan}
      >
        <Animated.View
          style={[{
            // height: sheetHeight,
            backgroundColor: "rgb(28, 28, 30)",
            borderTopLeftRadius: 48,
            borderTopRightRadius: 48,
            borderRadius: 56,
            overflow: "hidden",
            paddingHorizontal: 20,
            paddingBottom: 20,
            position: "absolute",
            bottom: 6,
            right: 6,
            left: 6,
          }, bottomSheetStyle]}
        >
          <Pressable
            onPress={() => {
              handleClose();
            }}
            style={{
              position: "absolute",
              top: 20,
              right: 20,
              height: 44,
              width: 44,
              backgroundColor: "rgba(11, 11, 11, 0.6)",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 24,
              zIndex: 12,
              shadowOffset: {
                height: 4,
                width: -3
              },
              shadowColor: "rgb(0, 0, 0)",
              shadowOpacity: 0.15,
              shadowRadius: 16,

              elevation: 5,
              overflow: "hidden"
            }}
          >
            <BlurView
              intensity={22}
              tint='dark'
              style={{
                height: "100%",
                width: '100%',
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "rgba(255, 255, 255, 0.1)"
              }}
            >
              <CloseIcon size={24} strokeWidth={2} color='rgb(255, 255, 255)' />
            </BlurView>
          </Pressable>

          <View
            style={{
              height: 12,
              width: "100%",
              paddingTop: 7,
              // justifyContent: "center",
              alignItems: "center"
            }}
          >
            <View
              style={{
                height: 5,
                width: 32,
                borderRadius: 32,
                backgroundColor: "rgba(120, 120, 128, 0.7)"
              }}
            />
          </View>

          {/* Title */}
          <View
            style={{
              paddingVertical: 12,
              justifyContent: "center",
              borderBottomWidth: 1,
              borderBottomColor: "rgba(255, 255, 255, 0.2)",
              marginBottom: 8
            }}
          >
            <Text
              style={{
                fontFamily: "SF Pro",
                fontWeight: "600",
                fontSize: 22,
                lineHeight: 32,
                color: 'rgba(255, 255, 255, 0.9)'
              }}
            >
              Select Playlist
            </Text>

            <Text
              style={{
                fontFamily: "SF Pro",
                fontWeight: "400",
                fontSize: 16,
                lineHeight: 24,
                color: "rgba(255, 255, 255, 0.6)"
              }}
            >
              Select or Create new playlist
            </Text>
          </View>

          {/* playlists */}
          <View
            style={{
              paddingVertical: 12
            }}
          >
            {
              addToPlaylists.map((item) => {
                return (
                  <Pressable
                    onPress={() => {
                      const body = {
                        podcastId: podcastId,
                        episodeId: tappedEpisode?.id,
                        playlistId: item.id
                      }
                      addingEpisode(body);
                      handleClose();
                    }}
                    key={item.id}
                    style={{
                      flexDirection: "row",
                      alignItems: "center"
                    }}
                  >
                    <View
                      style={{
                        height: 72,
                        width: 72,
                      }}
                    >
                      <Image
                        source={{
                          uri: item.image
                        }}
                        style={{
                          height: "100%",
                          width: "100%",
                          borderRadius: 8
                        }}
                      />
                    </View>
                    <View
                      style={{
                        paddingHorizontal: 12,
                        gap: 2
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: "SF Pro",
                          fontWeight: "600",
                          fontSize: 16,
                          lineHeight: 24,
                          color: 'rgba(255, 255, 255, 0.9)'
                        }}
                      >
                        {item.title}
                      </Text>
                      <Text
                        style={{
                          fontFamily: "SF Pro",
                          fontWeight: "400",
                          fontSize: 14,
                          lineHeight: 20,
                          color: "rgba(255, 255, 255, 0.6)"
                        }}
                      >
                        {item.createdAt}
                      </Text>
                    </View>
                  </Pressable>
                )
              })
            }

          </View>

          <Pressable
            onPress={handleNewPLaylist}
            style={{
              height: 44,
              width: "100%",
              borderRadius: 40,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "yellow",
              marginTop: 24
            }}
          >
            <Text
              style={{
                color: "black",
                fontFamily: "SF Pro",
                fontWeight: "500",
                fontSize: 15,
                lineHeight: 20
              }}
            >
              New Playlist
            </Text>
          </Pressable>


        </Animated.View>
      </GestureDetector>
    </View>
  );
};

export default PlaylistSelection;