import { Dimensions, View, Text, TouchableOpacity } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import Animated, { Extrapolation, interpolate, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { Gesture, GestureDetector, Pressable } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Play, Pause } from 'lucide-react-native';
import usePlayerStore from '@/store/usePlayerStore';
import AudioSlider from './AudioSlider';
import { Backward, Forward, SleepTimer, SpeedControl } from '@/Icons-assets/Icon';
import { useEffect } from 'react';

const { height: SCREEN_HEIGHT, width } = Dimensions.get("screen");
const MINIPLAYER_HEIGHT = 54

const CustomTab = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  const insets = useSafeAreaInsets();

  const { activeEpisode, isPlaying, togglePlay, progress, seekTo } = usePlayerStore();

  const startProgress = useSharedValue(0);
  const animationProgress = useSharedValue(1);
  const playingProgress = useSharedValue(0);

  const pan = Gesture.Pan()
    .onBegin(() => {
      startProgress.value = animationProgress.value;
    })
    .onUpdate((event) => {
      if (startProgress.value > 0.85) return;

      const dragDelta = event.translationY / (SCREEN_HEIGHT - MINIPLAYER_HEIGHT);
      animationProgress.value = Math.max(0, Math.min(1, (startProgress.value + dragDelta)));
    })
    .onEnd((event) => {
      if (startProgress.value > 0.85) return;

      if (event.velocityY > 500 || animationProgress.value > 0.6) {
        animationProgress.value = withSpring(1, { damping: 20, stiffness: 90, overshootClamping: true });
      }
      else {
        animationProgress.value = withSpring(0, { damping: 20, stiffness: 90, overshootClamping: true });
      }
    });

  const tap = Gesture.Tap()
    .onEnd((event) => {
      if (event.absoluteX > width * 0.72) return;

      if (animationProgress.value > 0.8) {
        animationProgress.value = withSpring(0, { damping: 20, stiffness: 90, overshootClamping: true });
      }
    });

  const composedGesture = Gesture.Simultaneous(pan, tap);

  const playerAnimationStytle = useAnimatedStyle(() => {
    const height = interpolate(
      animationProgress.value,
      [0, 1],
      [SCREEN_HEIGHT, MINIPLAYER_HEIGHT],
      Extrapolation.CLAMP
    );

    const bottomOffset = interpolate(
      animationProgress.value,
      [0, 1],
      [0, 104],
      Extrapolation.CLAMP
    );

    const marginHorizontal = interpolate(
      animationProgress.value,
      [0, 1],
      [0, 16]
    );

    const paddingTop = interpolate(
      animationProgress.value,
      [0, 1],
      [insets.top, 0],
      Extrapolation.CLAMP
    );

    const borderRadius = interpolate(
      animationProgress.value,
      [0, 1],
      [48, 12]
    );

    return {
      height,
      bottom: bottomOffset,
      right: marginHorizontal,
      left: marginHorizontal,
      paddingTop,
      borderRadius
    };
  });

  const tabBarAnimationStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      animationProgress.value,
      [0, 1],
      [100, 0],
      Extrapolation.CLAMP
    );

    return { transform: [{ translateY }] };
  });

  const miniPlayerStyle = useAnimatedStyle(() => {
    const paddingHorizontal = interpolate(
      animationProgress.value,
      [0, 1],
      [20, 10,],
      Extrapolation.CLAMP
    );

    const paddingVertical = interpolate(
      animationProgress.value,
      [0, 1],
      [32, 10],
      Extrapolation.CLAMP
    );

    return { paddingHorizontal, paddingVertical };
  });

  const coverStyle = useAnimatedStyle(() => {
    const height = interpolate(
      animationProgress.value,
      [0, 1],
      [353, 34],
      Extrapolation.CLAMP
    );

    const width = interpolate(
      animationProgress.value,
      [0, 1],
      [353, 34],
      Extrapolation.CLAMP
    );

    const borderRadius = interpolate(
      animationProgress.value,
      [0, 1],
      [32, 4]
    );

    return { height, width, borderRadius };
  });

  const miniControlsStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      animationProgress.value,
      [0, 0.85, 1],
      [0, 0, 1],
      Extrapolation.CLAMP
    );

    return { opacity };
  });

  const controlsStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      animationProgress.value,
      [0, 0.4],
      [1, 0],
      Extrapolation.CLAMP
    );

    const translateY = interpolate(
      animationProgress.value,
      [0, 1],
      [0, 20],
      Extrapolation.CLAMP
    );

    return {
      opacity,
      position: "absolute",
      top: insets.top + 417,
      width: "100%",
      left: 0,
      zIndex: 0,
      transform: [{ translateY: translateY }]
    };
  });

  useEffect(() => {
    playingProgress.value = withTiming(progress.position / progress.duration, { duration: 500 });
  }, [isPlaying, playingProgress, progress]);

  const progressAnimationStyle = useAnimatedStyle(() => {
    return {
      width: `${playingProgress.value * 100}%`,
    };
  });

  const handleForward = () => {
    const seekTarget = progress.position + 30;
    seekTo(seekTarget);
  };

  const handleRewind = () => {

    const seekTarget = progress.position - 10;
    seekTo(seekTarget);
  };

  return (
    <>
      {/* Player screen */}

      {activeEpisode &&
        <GestureDetector
          gesture={composedGesture}
        >
          <Animated.View
            style={[{
              position: "absolute",
              overflow: "hidden",
              backgroundColor: "rgb(255, 255, 255)",
              borderRadius: 12,
            }, playerAnimationStytle]}
          >
            <Animated.View
              collapsable={false}
              style={[{
                flexDirection: 'row',
                alignItems: "center",
                gap: 12,
              }, miniPlayerStyle]}
            >
              {/* Cover */}
              <Animated.View
                style={[{
                  // backgroundColor: "yellow",
                  overflow: "hidden",
                  flexShrink: 0
                }, coverStyle]}
              >
                <Image
                  style={{
                    height: "100%",
                    width: "100%",
                  }}
                  source={{ uri: activeEpisode?.image }}
                />
              </Animated.View>

              <Animated.View
                style={[{
                  flex: 1,
                  flexDirection: "row",
                  gap: 12,
                }, miniControlsStyle]}
              >
                {/* Miniplayer titles */}
                <View
                  style={{
                    flex: 1
                  }}
                >
                  <Text
                    numberOfLines={1}
                    style={{
                      fontFamily: "SF Pro",
                      fontSize: 13,
                      fontWeight: "600",
                      lineHeight: 16,
                      color: "black"
                    }}
                  >
                    {activeEpisode?.title}
                  </Text>

                  <Text
                    numberOfLines={1}
                    style={{
                      fontFamily: "SF Pro",
                      fontSize: 13,
                      fontWeight: "500",
                      lineHeight: 16,
                      color: "black",

                    }}
                  >
                    {activeEpisode?.podcastTitle}
                  </Text>
                </View>

                {/* controls */}
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 8,
                    paddingRight: 2
                  }}
                >
                  {/* Play and Pause */}
                  <Pressable
                    style={{
                      height: 34,
                      width: 34,
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                    onPress={() => togglePlay()}
                  >
                    {
                      isPlaying
                        ? <Pause size={22} strokeWidth={1.2} fill={"black"} />
                        : <Play size={22} strokeWidth={1.2} fill={"black"} />
                    }

                  </Pressable>

                  {/* Change  */}
                  <Pressable
                    onPress={handleForward}
                  >
                    <Forward size={22} strokeWidth={1.2} />
                  </Pressable>
                </View>
              </Animated.View>

              <Animated.View
                style={[{
                  backgroundColor: "rgba(0, 0, 0, 0.2)",
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  zIndex: -4
                }, progressAnimationStyle, miniControlsStyle]}
              />
            </Animated.View>

            {/* FUll Screen controls */}
            <Animated.View
              style={[controlsStyle]}
            >
              {/* title */}
              <View
                style={{
                  gap: 2,
                  paddingHorizontal: 20
                }}
              >
                {/* Episode Title */}
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
                  {activeEpisode?.title}
                </Text>

                {/* Podcast Title */}
                <Text
                  style={{
                    fontFamily: "SF Pro",
                    fontSize: 18,
                    fontWeight: "400",
                    lineHeight: 28
                  }}
                >
                  {activeEpisode?.podcastTitle}
                </Text>
              </View>

              {/* Slider */}
              <AudioSlider />

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
                    <SpeedControl size={24} />
                  </View>

                  <TouchableOpacity
                    onPress={handleRewind}
                    style={{
                      alignContent: 'center',
                      justifyContent: 'center',
                      width: 40,
                      height: 40
                    }}
                  >
                    <Backward size={32} strokeWidth={1.88} />
                  </TouchableOpacity>

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
                      <Pause size={28} strokeWidth={2} fill={'black'} />
                    ) : (
                      <Play size={28} strokeWidth={2} fill={'black'} />
                    )}
                  </Pressable>

                  <TouchableOpacity
                    onPress={() => handleForward()}
                    style={{
                      alignContent: 'center',
                      justifyContent: 'center',
                      width: 40,
                      height: 40
                    }}
                  >
                    <Forward size={32} strokeWidth={1.88} />
                  </TouchableOpacity>

                  <View>
                    <SleepTimer size={24} />
                  </View>
                </View>

                <View></View>
              </View>
            </Animated.View>

          </Animated.View>
        </GestureDetector>
      }

      {/* Navigation Tab */}
      <Animated.View
        style={[{
          flexDirection: "row",
          width: width - 32,
          position: "absolute",
          bottom: 32,
          right: 16,
          left: 16,
          backgroundColor: "white",
          height: 64,
          borderRadius: 32
        }, tabBarAnimationStyle]}
      >
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;

          const { options } = descriptors[route.key];

          const icon = options.tabBarIcon ? options.tabBarIcon({ focused: isFocused, color: 'yellow', size: 22 }) : null;

          if (!icon) return null;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name)
            }
          }

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                gap: 2
              }}
            >
              {icon}

              <Text
                style={{
                  fontFamily: "SF Pro",
                  fontSize: 10,
                  fontWeight: `${isFocused ? "700" : "600"}`,
                  lineHeight: 12
                }}
              >
                {options.title}
              </Text>
            </Pressable>
          )
        })}

      </Animated.View>
    </>

  );
};

export default CustomTab;