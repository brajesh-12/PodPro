import { View } from 'react-native';
import { createAnimatedComponent, useAnimatedProps, useSharedValue, withTiming } from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';
import LottieView from 'lottie-react-native';
import useDownloadStore from '@/store/useDownloadStore';
import { useEffect, useRef } from 'react';
import { SavedEpisode } from '@/store/useSubscriptionStore';

const AnimatedCircle = createAnimatedComponent(Circle);
const RADIUS = 11
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const AnimatedDownloadIcon = ({ episode }: { episode: SavedEpisode }) => {
  const { activeDownloads } = useDownloadStore();

  const progress = useSharedValue(1);

  const lottieRef = useRef<LottieView>(null);
  const isDownloading = activeDownloads[episode.id] !== undefined;

  useEffect(() => {
    if(isDownloading) {
      lottieRef.current?.play();
    } else {
      lottieRef.current?.reset();
    }
  }, [isDownloading, activeDownloads, episode.id]);

  useEffect(() => {
    if (isDownloading) {
      progress.value = withTiming(activeDownloads[episode.id], {duration: 150});
    } else {
      progress.value = withTiming(1, {duration: 300});
    }
  }, [progress, activeDownloads, episode.id, isDownloading]);

  const animatedProps = useAnimatedProps(() => {
    return {
      strokeDashoffset: CIRCUMFERENCE - CIRCUMFERENCE * progress.value,
    };
  });

  return (
    <View
      style={{
        height: 20,
        width: 20,
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <LottieView
        ref={lottieRef}
        source={require("@/assets/micro-animation/icon.json")}
        style={{
          position: "absolute",
          right: 0,
          left: 0,
          top: 0,
          bottom: 0
        }}
        loop={true}
        // autoPlay={true}
      />
      <Svg
        height={26}
        width={26}
        viewBox="0 0 26 26"
        style={{ transform: [{ rotate: '-90deg' }] }}
      >
        <Circle
          cx={13}
          cy={13}
          r={RADIUS}
          stroke={'#000'}
          opacity={0.3}
          strokeWidth={1.8}
          fill={"none"}
        />
        <AnimatedCircle
          cx={13}
          cy={13}
          r={RADIUS}
          fill={"none"}
          stroke={"#000"} strokeDasharray={CIRCUMFERENCE}
          strokeWidth={1.8}
          strokeLinecap={"round"}
          animatedProps={animatedProps}
        />
      </Svg>
    </View>
  )
}

export default AnimatedDownloadIcon;