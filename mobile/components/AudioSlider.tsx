import { View, Text } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSpring } from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import usePlayerStore from '@/store/usePlayerStore';
import { useEffect, useState } from 'react';
import { formatProgress } from '@/lib/utils';
import { scheduleOnRN } from 'react-native-worklets';

const AudioSlider = () => {

  const { progress, seekTo } = usePlayerStore();
  const [isDragging, setIsDragging] = useState(false);
  const [draggingValue, setDraggingValue] = useState(0);

  // const isDragging = useSharedValue(false);
  const playingProgress = useSharedValue(0);
  const sliderWidth = useSharedValue(0);

  const finishSeeking = (targetTime: any) => {
    if (seekTo) {
      seekTo(targetTime);
    }

    const timeout = setTimeout(() => {
      setIsDragging(false)
    }, 700);
    return () => clearTimeout(timeout);
  };

  const pan = Gesture.Pan()
    .onBegin(() => {
      scheduleOnRN(setIsDragging, true)
      scheduleOnRN(setDraggingValue, playingProgress.value * progress.duration);
    })
    .onUpdate((event) => {
      if (sliderWidth.value > 0) {
        playingProgress.value = Math.max(0, Math.min(1, (event.x / sliderWidth.value)));
        scheduleOnRN(setDraggingValue, playingProgress.value * progress.duration);
      }
    })
    .onFinalize(() => {
      const targetTime = playingProgress.value * progress.duration;

      scheduleOnRN(finishSeeking, targetTime);

      // if(seekTo) {
      //   scheduleOnRN(seekTo, targetTime);
      // };
      // scheduleOnRN(setIsDragging, false);
      // scheduleOnRN(finishSeeking, targetTime);
    });

  useEffect(() => {
    if (!isDragging) {
      playingProgress.value = withTiming(progress.position / progress.duration, { duration: 300 });
    };
  }, [progress.position, progress.duration, playingProgress, isDragging]);

  const activeTrackStyle = useAnimatedStyle(() => {
    return { width: `${playingProgress.value * 100}%` }
  });

  const focusAnimationStyle = useAnimatedStyle(() => {
    return {
      height: isDragging ? withSpring(10) : withSpring(6)
    }
  });

  return (
    <View
      style={{
        width: "100%",
        paddingHorizontal: 24,
      }}
    >
      <Animated.View>
        <GestureDetector
          gesture={pan}
        >
          <Animated.View
            onLayout={(event) => sliderWidth.value = event.nativeEvent.layout.width}
            style={[{
              height: 30,
              justifyContent: "center"
            }]}
          >

            {/* Background track */}
            <Animated.View
              style={[{
                height: 6,
                width: "100%",
                backgroundColor: "rgba(255, 255, 255, 0.3)",
                position: "absolute",
                borderRadius: 16
              }, focusAnimationStyle]}
            />

            {/* Active track */}
            <Animated.View
              style={[{
                height: 6,
                backgroundColor: "rgb(255, 255, 255)",
                position: "absolute",
                borderRadius: 16
              }, activeTrackStyle, focusAnimationStyle]}
            />

            {/* Draggable thumb */}
            {/* <Animated.View
            style={[{
              position: "absolute",
              height: 30,
              width: 5,
              justifyContent: "center",
              alignItems: "flex-end",
              left: 0,
              // backgroundColor: "red"
            }, activeTrackStyle ]}
          >
            <Animated.View
              style={[{
                height: 20,
                width: 20,
                borderRadius: 32,
                backgroundColor: "white",
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 3,
              }, thumbStyle]}
            ></Animated.View>
          </Animated.View> */}
          </Animated.View>
        </GestureDetector>

        {/* time */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          <Text
            style={{
              fontFamily: "SF Pro",
              fontSize: 12,
              fontWeight: "600",
              lineHeight: 12,
              color: 'rgb(255, 255, 255)'
            }}
          >
            {isDragging
              ? formatProgress(draggingValue)
              : formatProgress(progress.position)
            }
          </Text>

          <Text
            style={{
              fontFamily: "SF Pro",
              fontSize: 12,
              fontWeight: "600",
              lineHeight: 12,
              color: 'rgb(255, 255, 255)'
            }}
          >
            {formatProgress(progress.duration)}
          </Text>
        </View>
      </Animated.View>

    </View>
  );
};

export default AudioSlider;