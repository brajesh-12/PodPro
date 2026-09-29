import { Dimensions, View, Text, TouchableOpacity, StyleSheet, Pressable } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import Animated, { createAnimatedComponent, Extrapolation, interpolate, interpolateColor, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Play, Pause } from 'lucide-react-native';
import usePlayerStore from '@/store/usePlayerStore';
import AudioSlider from './AudioSlider';
import { SleepTimer, SpeedControl, Forward2, Backward2, Save, PlayQueue } from '@/Icons-assets/Icon';
import { useEffect } from 'react';
import { BlurView } from 'expo-blur';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import ButtonStyle from '@/constants/buttonStyles';

const { height: SCREEN_HEIGHT, width } = Dimensions.get("screen");
const MINIPLAYER_HEIGHT = 54

const AnimatedMaskedView = createAnimatedComponent(MaskedView);

const CustomTab = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  const insets = useSafeAreaInsets();

  const { activeEpisode, isPlaying, togglePlay, progress, seekTo } = usePlayerStore();

  const backgroundHeight = activeEpisode ? 190 : 120;

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
      [0, 24]
    );

    const paddingTop = interpolate(
      animationProgress.value,
      [0, 1],
      [insets.top + 32, 0],
      Extrapolation.CLAMP
    );

    const borderRadius = interpolate(
      animationProgress.value,
      [0, 1],
      [48, 12]
    );

    const backgroundColor = interpolateColor(
      animationProgress.value,
      [0, 1],
      ["rgba(11, 11, 11, 1)", "rgba(11, 11, 11, 0.6)"],
    );

    return {
      height,
      bottom: bottomOffset,
      right: marginHorizontal,
      left: marginHorizontal,
      paddingTop,
      borderRadius,
      backgroundColor
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
      [24, 10,],
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
      top: insets.top + 449,
      // bottom: 32,
      width: "100%",
      left: 0,
      zIndex: animationProgress.value > 0.5 ? -1 : 10,
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
      {/* background Blur */}
      <MaskedView
        style={{
          position: "absolute",
          bottom: 0,
          right: 0,
          left: 0,
          height: backgroundHeight,
        }}
        maskElement={
          <LinearGradient
            style={StyleSheet.absoluteFill}
            colors={['rgba(11, 11, 11, 1)', 'rgba(11, 11, 11, 0)']}
            start={{ x: 0, y: 1 }}
            end={{ x: 0, y: 0 }}
          />
        }
      >
        <BlurView
          intensity={22}
          tint="dark"
          style={{
            position: "absolute",
            bottom: 0,
            right: 0,
            left: 0,
            top: 0,
            backgroundColor: "rgba(11, 11, 11, 0.4)",
          }}
        />
      </MaskedView>

      {/* Player screen */}
      {activeEpisode &&
        <GestureDetector
          gesture={composedGesture}
        >
          <Animated.View
            style={[{
              position: "absolute",
              overflow: "hidden",
              backgroundColor: "rgb(11, 11, 11)",
              borderRadius: 12,
              shadowColor: "rgb(0, 0, 0)",
              shadowOpacity: 0.15,
              shadowRadius: 2,
              shadowOffset: {
                height: 4,
                width: 2
              }
            }, playerAnimationStytle]}
          >
            <Animated.View
              collapsable={false}
              style={[{
                flexDirection: 'row',
                alignItems: "center",
                gap: 12,
                // backgroundColor: "red"
              }, miniPlayerStyle]}
            >

              <AnimatedMaskedView
                style={[{
                  position: "absolute",
                  right: 0,
                  left: 0,
                  top: 0,
                  bottom: 0,
                  height: "auto",
                }, miniControlsStyle]}
                maskElement={
                  <LinearGradient
                    style={[
                      StyleSheet.absoluteFill
                    ]}
                    colors={['rgba(11, 11, 11, 1)', 'rgba(11, 11, 11, 1)']}
                    start={{ x: 1, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  />
                }
              >
                <BlurView
                  style={{
                    position: "absolute",
                    right: 0,
                    left: 0,
                    top: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(11, 11, 11, 0.4)'
                  }}
                  intensity={24}
                />
              </AnimatedMaskedView>
              {/* Cover */}
              <Animated.View
                style={[{
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
                      color: "rgb(255, 255, 255)"
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
                      color: "rgb(255, 255, 255)",

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
                        ? <Pause size={22} strokeWidth={1.2} fill={"rgb(255, 255, 255)"} />
                        : <Play size={22} strokeWidth={1.2} fill={"rgb(255, 255, 255)"} color={'rgb(255, 255, 255)'} />
                    }

                  </Pressable>

                  {/* Change  */}
                  <TouchableOpacity
                    onPress={handleForward}
                  >
                    <Forward2 size={24} fill='rgb(255, 255, 255)' />
                  </TouchableOpacity>
                </View>
              </Animated.View>

              <Animated.View
                pointerEvents={"none"}
                style={[{
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  zIndex: -1
                }, progressAnimationStyle, miniControlsStyle]}
              />
            </Animated.View>

            {/* FUll Screen controls */}
            <Animated.View
              style={[{
                gap: 32
              }, controlsStyle]}
            >
              {/* title */}
              <View
                style={{
                  gap: 2,
                  paddingHorizontal: 24,
                  justifyContent: "center"
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
                    lineHeight: 28,
                    color: "rgb(255, 255, 255)"
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
                    lineHeight: 24,
                    color: "rgb(255, 255, 255)",
                    textAlignVertical: "center"
                  }}
                >
                  {activeEpisode?.podcastTitle}
                </Text>
              </View>

              <View style={{
                gap: 32
              }}>
                {/* Slider */}
                <AudioSlider />

                {/* Controls */}
                <View
                  style={{
                    flexDirection: "row",
                    paddingHorizontal: 28,
                    alignItems: "center",
                    justifyContent: "space-between"
                  }}
                >
                  <View>
                    <SpeedControl size={24} color='rgba(255, 255, 255, 0.8)' />
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
                    <Backward2 size={40} fill='rgba(255, 255, 255, 0.8)' />
                  </TouchableOpacity>

                  {/* Play and Pause */}
                  <Pressable
                    onPress={() => togglePlay()}
                    style={{
                      height: 48,
                      width: 48,
                      borderRadius: 140,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {isPlaying ? (
                      <Pause size={48} strokeWidth={0} fill={'rgb(255, 255, 255)'} />
                    ) : (
                      <Play size={48} strokeWidth={0} fill={'rgb(255, 255, 255)'} />
                    )}
                  </Pressable>

                  <TouchableOpacity
                    onPress={handleForward}
                    style={{
                      alignContent: 'center',
                      justifyContent: 'center',
                      width: 40,
                      height: 40
                    }}
                  >
                    <Forward2 size={40} fill='rgba(255, 255, 255, 0.8)' />
                  </TouchableOpacity>

                  <View>
                    <SleepTimer size={24} color='rgba(255, 255, 255, 0.8)' />
                  </View>
                </View>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingHorizontal: 24
                }}
              >
                <Pressable
                  style={[{
                    height: 50,
                    width: 50,
                    alignItems: "center",
                    justifyContent: 'center',
                    borderRadius: 24
                  }, ButtonStyle.singleButton]}
                >
                  <Save size={24} strokeWidth={1.5} color='rgb(255, 255, 255)' />
                </Pressable>

                <Pressable
                  style={[{
                    height: 50,
                    width: 50,
                    alignItems: "center",
                    justifyContent: 'center',
                    borderRadius: 24
                  }, ButtonStyle.singleButton]}
                >
                  <PlayQueue size={24} fill='rgb(255, 255, 255)' />
                </Pressable>
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
          backgroundColor: "rgba(11, 11, 11, 0.8)",
          height: 64,
          borderRadius: 32,
          shadowColor: "rgb(0, 0, 0)",
          shadowOpacity: 0.18,
          shadowRadius: 6,
          shadowOffset: {
            height: 1,
            width: 1
          }
        }, tabBarAnimationStyle]}
      >
        <MaskedView
          style={{
            position: "absolute",
            right: 0,
            left: 0,
            top: 0,
            bottom: 0,
            height: 64,
            borderRadius: 32
          }}
          maskElement={
            <LinearGradient
              style={[StyleSheet.absoluteFill, {
                borderRadius: 32,
              }]}
              colors={['rgba(11, 11, 11, 1)', 'rgba(11, 11, 11, 1)']}
              start={{ x: 1, y: 0 }}
              end={{ x: 1, y: 0 }}
            />
          }
        >
          <BlurView
            style={{
              position: "absolute",
              right: 0,
              left: 0,
              top: 0,
              bottom: 0,
              backgroundColor: 'rgba(11, 11, 11, 0.4)'
            }}
            intensity={22}
          />
        </MaskedView>

        {state.routes.map((route, index) => {
          const isFocused = state.index === index;

          const { options } = descriptors[route.key];

          const icon = options.tabBarIcon ? options.tabBarIcon({ focused: isFocused, color: 'white', size: 22 }) : null;

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
                  lineHeight: 12,
                  color: `${isFocused ? "rgb(255, 255, 255)" : "rgba(255, 255, 255, 0.6)"}`
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