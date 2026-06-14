import { View, Dimensions, Text, Pressable } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, interpolate, Extrapolation } from 'react-native-reanimated';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

const { height: SCREEN_HEIGHT } = Dimensions.get("screen");
const MINIPLAYER_HEIGHT = 54;
const TABBAR_HEIGHT = 40;

const TestModal = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const animationProgress = useSharedValue(1);
  const startProgress = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .onBegin(() => {
      startProgress.value = animationProgress.value;
    })
    .onUpdate((event) => {
      if (startProgress.value > 0.6) return;

      const dragDelta = event.translationY / (SCREEN_HEIGHT - MINIPLAYER_HEIGHT);
      animationProgress.value = Math.max(0, Math.min(1, startProgress.value + dragDelta));
    })
    .onEnd((event) => {
      if (startProgress.value > 0.6) return;

      if (event.velocityY > 500 || animationProgress.value > 0.2) {
        animationProgress.value = withSpring(1, { damping: 20, stiffness: 90, overshootClamping: true });
      }
      else {
        animationProgress.value = withSpring(0, { damping: 20, stiffness: 90, overshootClamping: true });
      }
    });

  const tap = Gesture.Tap()
    .onEnd(() => {
      if (animationProgress.value > 0.8) {
        animationProgress.value = withSpring(0, { damping: 20, stiffness: 90, overshootClamping: true });
      };
    });


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
      [0, TABBAR_HEIGHT + 32],
      Extrapolation.CLAMP
    );

    const marginHorizontal = interpolate(
      animationProgress.value,
      [0, 1],
      [0, 16],
      Extrapolation.CLAMP
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
      [48, 12],
      Extrapolation.CLAMP
    );

    // const paddingHorizontal = interpolate(
    //   animationProgress.value,
    //   [0, 1],
    //   [20, 12]
    // );

    return {
      height,
      bottom: bottomOffset,
      right: marginHorizontal,
      left: marginHorizontal,
      paddingTop,
      borderRadius,
      // paddingHorizontal
    };
  });

  const tabBarAnimationStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      animationProgress.value,
      [0, 1],
      [20, -32],
      Extrapolation.CLAMP
    );

    return { transform: [{ translateY }] };
  });

  const coverContainerStytle = useAnimatedStyle(() => {
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
      [32, 4],
      Extrapolation.CLAMP
    );

    return { height, width, borderRadius };
  });

  const opacityStytle = useAnimatedStyle(() => {
    const opacity = interpolate(
      animationProgress.value,
      [0, 0.85, 1],
      [0, 0, 1],
      Extrapolation.CLAMP
    );

    return {
      opacity,
    };
  });

  const controlsOpacity = useAnimatedStyle(() => {
    const opacity = interpolate(
      animationProgress.value,
      [0, 0.70],
      [1, 0]
    );
    return { opacity };
  });

  const miniControlStytle = useAnimatedStyle(() => {
    const paddingVertical = interpolate(
      animationProgress.value,
      [0, 1],
      [24, 10],
      Extrapolation.CLAMP
    );

    const paddingHorizontal = interpolate(
      animationProgress.value,
      [0, 1],
      [20, 10]
    );

    return { paddingVertical, paddingHorizontal };
  });

  const composedGesture = Gesture.Simultaneous(panGesture, tap)

  return (
    <GestureHandlerRootView>
      {/* main screen */}
      <View
        style={{
          flex: 1,
          backgroundColor: "grey",
          position: "relative",
        }}
      >
        <Pressable
          onPress={() => {
            router.back();
          }}
          style={{
            height: 56,
            width: 56,
            backgroundColor: 'red',
            position: 'absolute',
            top: insets.top + 32,
            left: 20,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 56
          }}
        >
          <Text>
            Back
          </Text>
        </Pressable>
        <GestureDetector
          gesture={composedGesture}
        >
          <Animated.View
            style={[{
              position: "absolute",
              backgroundColor: "blue",
              overflow: "visible",
              borderRadius: 12,
            }, playerAnimationStytle]}
          >
            {/* cover and title */}
            <Animated.View
              style={[{
                flexDirection: 'row',
                alignItems: "center",
                gap: 12,
              }, miniControlStytle]}
            >
              {/* cover */}
              <Animated.View
                style={[{
                  backgroundColor: "yellow"
                }, coverContainerStytle]}
              >
              </Animated.View>

              {/* Titles */}
              <Animated.View
                style={[{
                  flex: 1,
                  gap: 12,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between"
                }, opacityStytle]}
              >
                <View>
                  <Text
                    style={{
                      fontFamily: "SF Pro",
                      fontSize: 14,
                      fontWeight: "700",
                      lineHeight: 16,
                      color: "white"
                    }}
                  >
                    Episode Title
                  </Text>

                  <Text
                    style={{
                      fontFamily: "SF Pro",
                      fontSize: 13,
                      fontWeight: "600",
                      lineHeight: 16,
                      color: "white"
                    }}
                  >
                    Podcast Title
                  </Text>
                </View>

                <View>
                  <Text
                    style={{
                      color: "white"
                    }}
                  >
                    Controls
                  </Text>
                </View>

              </Animated.View>

            </Animated.View>

            {/* Should be visible in full screen only */}
            <Animated.View
              style={[{
                height: 200,
                width: "100%",
                paddingHorizontal: 20,
                backgroundColor: "pink",
                marginTop: 32
              }, controlsOpacity]}
            >
              {/* Slider */}
              <View>
                <Text>Slider</Text>
              </View>

              {/* Controls */}
              <View></View>
            </Animated.View>

          </Animated.View>
        </GestureDetector>
        {/* tabbar */}
        <Animated.View
          style={[{
            position: "absolute",
            bottom: 0,
            right: 0,
            left: 0,
            height: 20,
            backgroundColor: "red"
          }, tabBarAnimationStyle]}
        ></Animated.View>

      </View>
    </GestureHandlerRootView>
  );
};

export default TestModal;