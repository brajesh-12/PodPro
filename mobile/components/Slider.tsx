import { View, Text } from 'react-native'
import Animated, { useSharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { GestureDetector, Gesture, GestureHandlerRootView } from 'react-native-gesture-handler';
import usePlayerStore from '@/store/usePlayerStore';
import { useEffect, useState } from 'react';
import { scheduleOnRN } from 'react-native-worklets';
import { formatProgress } from '@/lib/utils';

interface CustomSliderProps {
  width: number;
}

const Slider = ({ width }: CustomSliderProps) => {
  const { seekTo, progress, isPlaying, minimized } = usePlayerStore();
  const [slidingValue, setSlidingValue] = useState(0);
  const [slidingState, setSlidingState] = useState(false);

  const sliderWidth = 353;
  const isSliding = useSharedValue<boolean>(false);
  const offset = useSharedValue(0);

  const progressPercent = progress.duration > 0 ? progress.position / progress.duration : 0;
  const translateX = useSharedValue(progressPercent * sliderWidth); // position of player;

  const syncContainerWidth = useSharedValue(progressPercent * sliderWidth);

  useEffect(() => {
    if (isPlaying && !isSliding.value) {
      syncContainerWidth.set((progress.position / progress.duration) * 353)
    }
  }, [syncContainerWidth, progress.position, progress.duration, isPlaying, isSliding]);

  useEffect(() => {
    if (progress.duration > 0) {
      translateX.set(((progress.position / progress.duration) * sliderWidth) - 4);
    }
  }, [progress.position, progress.duration, translateX]);

  const panGesture = Gesture.Pan()
    .onBegin(() => {
      isSliding.value = true;
      scheduleOnRN(setSlidingState, true);
      offset.value = translateX.value;
    })
    .onChange((event) => {
      let nextX = offset.value + event.translationX;
      nextX = Math.max(0, Math.min(nextX, sliderWidth));

      const slidingPercent = nextX / sliderWidth;
      const slidingValue = slidingPercent * progress.duration;
      scheduleOnRN(setSlidingValue, slidingValue);
      syncContainerWidth.value = nextX;
    })
    .onFinalize(() => {
      isSliding.set(false);
      scheduleOnRN(setSlidingState, false);
      const newPercent = syncContainerWidth.value / sliderWidth;

      let seekTime = newPercent * progress.duration;
      seekTime = Math.max(0, Math.min(seekTime, progress.duration));

      if (seekTo) {
        scheduleOnRN(seekTo, seekTime);
      }
    });

  const activeContainerStyle = useAnimatedStyle(() => ({
    width: syncContainerWidth.value
  }));

  const thumbCircleStyle = useAnimatedStyle(() => ({
    transform: [{
      scale: isSliding.value ? 1.5 : 1
    }]
  }));

  if (minimized) {
    return (
      <GestureHandlerRootView>
        <Animated.View
          style={[{
            position: "absolute",
            flexDirection: "row",
            gap: -4,
            alignItems: "center",
            alignContent: "flex-start",
            maxWidth: 393,
            minWidth: 0,
            backgroundColor: "grey"
          }, activeContainerStyle]}
        >
          {/* active track */}
          <Animated.View
            style={[
              {
                width: "100%",
                height: 2,
                backgroundColor: "black",
              },
            ]}
          />
        </Animated.View>
      </GestureHandlerRootView>
    )
  }

  return (
    <GestureHandlerRootView
      style={[{
        height: 40,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 20,
      }, { width: width }]}
    >
      {/* Main slider */}
      <Animated.View
        style={{
          height: 8,
          justifyContent: "center",
          width: sliderWidth,
          position: "relative",
        }}
      >
        {/* Track Background */}
        <View
          style={{
            height: 6,
            backgroundColor: '#E5E5EA',
            borderRadius: 3,
            width: '100%',
          }}
        />

        <GestureDetector
          gesture={panGesture}
        >
          <Animated.View
            style={[{
              position: "absolute",
              flexDirection: "row",
              gap: -4,
              alignItems: "center",
              alignContent: "flex-start",
              maxWidth: 353,
              minWidth: 0
            }, activeContainerStyle]}
          >
            {/* active track */}
            <Animated.View
              style={[
                {
                  width: "100%",
                  height: 4,
                  backgroundColor: "black",
                },
              ]}
            />

            {/* Interative Circle */}
            <Animated.View
              style={[{
                height: 12,
                width: 12,
                borderRadius: 40,
                backgroundColor: "black",
              }, thumbCircleStyle]}
            />
          </Animated.View>

        </GestureDetector>

        {/* Interactive Thumb */}
        {/* <Animated.View
            style={[{
              width: 20,
              height: 20,
              borderRadius: 10,
              position: 'absolute',
              elevation: 3, // Android shadow
              shadowColor: "#000", // iOS shadow
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 2,
            }, animatedThumbStyle]}
          /> */}

      </Animated.View>

      <View
        style={{
          height: 16,
          width: 393,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 20,
          marginTop: 8
        }}
      >
        <Text
          style={{
            fontFamily: "SF Pro",
            fontSize: 12,
            fontWeight: "500",
            lineHeight: 16
          }}
        >
          {
            slidingState
              ? formatProgress(slidingValue)
              : formatProgress(progress.position)
          }
        </Text>

        <Text
          style={{
            fontFamily: "SF Pro",
            fontSize: 12,
            fontWeight: "500",
            lineHeight: 16
          }}
        >
          {formatProgress(progress.duration)}
        </Text>
      </View>
    </GestureHandlerRootView>
  )
}

export default Slider;