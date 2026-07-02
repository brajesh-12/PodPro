import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import Animated, { cancelAnimation, useAnimatedStyle, useSharedValue, withRepeat, withDelay, withTiming, Easing } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

export enum ANIMATION_DIRECTION {
  leftToRight = 'leftToRight',
  rightToLeft = "rightToLeft",
  topToBottom = "topToBottom",
  bottomToTop = "bottomToTop"
};

export enum ANIMTION_TYPE {
  shiver = "shiver",
  pulse = "pulse"
};

const SkeletonLoader = ({
  height,
  width,
  style = {},
  backgroundColor = "#DDEAF5",
  direction = ANIMATION_DIRECTION.leftToRight,
  animation = ANIMTION_TYPE.shiver
}: { height: any, width: any, style: any, backgroundColor: string, direction: string, animation: string }) => {

  const isXDirectionAnimation = direction === ANIMATION_DIRECTION.leftToRight || direction === ANIMATION_DIRECTION.rightToLeft;

  const translateX = useSharedValue(0);
  const [parentDimensions, setParentDimensions] = useState({
    height: -1,
    width: -1
  });

  const [gradientDimensions, setGradientDimensions] = useState({
    height: -1,
    width: -1
  });

  const [coordinates, setCoordinates] = useState({
    start: { x: 0, y: 0 },
    end: { x: 1, y: 0 }
  });

  const animationStyleX = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value }
      ]
    };
  });

  useEffect(() => {
    return () => {
      cancelAnimation(translateX);
    };
  }, []);

  useEffect(() => {
    if (!direction) return;
    switch (direction) {
      case ANIMATION_DIRECTION.leftToRight:
        setCoordinates({
          start: { x: 0, y: 0 },
          end: { x: 1, y: 0 },
        });
        break;
      case ANIMATION_DIRECTION.rightToLeft:
        setCoordinates({
          start: { x: 1, y: 0 },
          end: { x: 0, y: 0 },
        });
        break;
      case ANIMATION_DIRECTION.topToBottom:
        setCoordinates({
          start: { x: 0, y: 0 },
          end: { x: 0, y: 1 },
        });
        break;
      case ANIMATION_DIRECTION.bottomToTop:
        setCoordinates({
          start: { x: 0, y: 1 },
          end: { x: 0, y: 0 },
        });
        break;
      default:
        break;
    }
  }, [direction]);

  const animateAcrossXDirection = () => {
    const overflowOffset = parentDimensions.width * 0.75;
    const leftMostEnd = -overflowOffset;
    const rightMostEnd = parentDimensions.width - gradientDimensions.width + overflowOffset;

    translateX.value = direction === ANIMATION_DIRECTION.leftToRight ? leftMostEnd : rightMostEnd;

    translateX.value = withRepeat(
      withDelay(
        900, //Delay before the next iteration of animation starts
        withTiming(parentDimensions.width, {
          duration: 500,
          easing: Easing.linear,
        })
      ),
      -1
    );
  };

  useEffect(() => {
    if (
      parentDimensions.height !== -1 &&
      parentDimensions.width !== -1 &&
      gradientDimensions.height !== -1 &&
      gradientDimensions.width !== -1 &&
      direction
    ) {
      if (isXDirectionAnimation) {
        animateAcrossXDirection();
      }
    }
    // eslint-disable-next-line
  }, [parentDimensions, direction, isXDirectionAnimation]);

  return (
    <Animated.View
      onLayout={(event) => {
        if (
          parentDimensions.height === -1 &&
          parentDimensions.width === -1 &&
          animation === ANIMTION_TYPE.shiver
        ) {
          setParentDimensions({
            height: event.nativeEvent.layout.height,
            width: event.nativeEvent.layout.width
          });
        }
      }}
      style={[{
        height,
        width,
        backgroundColor,
        overflow: "hidden"
      }, style]}
    >
      {animation === ANIMTION_TYPE.shiver ? (
        <Animated.View
          onLayout={(event) => {
            if (
              gradientDimensions.height === -1 &&
              gradientDimensions.width === -1 &&
              animation === ANIMTION_TYPE.shiver
            ) {
              setGradientDimensions({
                height: event.nativeEvent.layout.height,
                width: event.nativeEvent.layout.width
              });
            }
          }}
          style={[
            isXDirectionAnimation && {
              height: "100%",
              width: "80%",
            },
            isXDirectionAnimation && animationStyleX,
          ]}
        >
          <LinearGradient
            colors={[
              "rgba(255,255,255,0)",
              "rgba(255,255,255,0.1)",
              "rgba(255,255,255,0.4)",
              "rgba(255,255,255,0.6)",
              "rgba(255,255,255,0.7)",
              "rgba(255,255,255,0.6)",
              "rgba(255,255,255,0.4)",
              "rgba(255,255,255,0.1)",
              "rgba(255,255,255,0)",
            ]}
            style={{
              height: "100%",
              width: "100%"
            }}
            start={coordinates.start}
            end={coordinates.end}
          />
        </Animated.View>
      ) : null}
    </Animated.View>
  );
};

export const PodcastSkeleton = () => {
  return (
    <View
      style={{
        overflow: "hidden"
      }}
    >
      <View
        style={{
          height: 160,
          width: 160,
        }}
      >
        <SkeletonLoader
          height={"100%"}
          width={"100%"}
          style={{
            borderRadius: 12
          }}
          backgroundColor='rgba(107, 107, 107, 0.3)'
          direction="leftToRight"
          animation='shiver'
        />
      </View>

      <View
        style={{
          height: 20,
          width: 160,
          marginVertical: 8
        }}
      >
        <SkeletonLoader
          height={"100%"}
          width={"100%"}
          style={{
            borderRadius: 4
          }}
          backgroundColor='rgba(107, 107, 107, 0.3)'
          direction="leftToRight"
          animation='shiver'
        />
      </View>

      <View
        style={{
          height: 20,
          width: 160
        }}
      >
        <SkeletonLoader
          height={"100%"}
          width={"100%"}
          style={{
            borderRadius: 4
          }}
          backgroundColor='rgba(107, 107, 107, 0.3)'
          direction="leftToRight"
          animation='shiver'
        />
      </View>
    </View>
  )
};

export const SectionSkeleton = () => {
  return (
    <View
      style={{
        paddingLeft: 20,
        marginBottom: 24
      }}
    >
      <View
        style={{
          height: 38,
          width: "100%",
          marginBottom: 24,
        }}
      >
        <SkeletonLoader
          height={"100%"}
          width={"100%"}
          style={{
            borderRadius: 2
          }}
          backgroundColor='rgba(107, 107, 107, 0.3)'
          direction="leftToRight"
          animation='shiver'
        />
      </View>

      <View
        style={{
          flexDirection: "row",
          gap: 16,
        }}
      >
        <PodcastSkeleton />
        <PodcastSkeleton />
        <PodcastSkeleton />
      </View>
    </View>

  )
};

export const NewEpisodesSkeleton = () => {
  return (
    <View
      style={{
        paddingLeft: 20
      }}
    >
      <View
        style={{
          height: 36,
          width: "100%",
          marginBottom: 20
        }}
      >
        <SkeletonLoader
          height={"100%"}
          width={"100%"}
          style={{
            borderRadius: 4
          }}
          backgroundColor='rgba(107, 107, 107, 0.3)'
          direction="leftToRight"
          animation='shiver'
        />
      </View>

      <View
        style={{
          flexDirection: "row",
          gap: 16
        }}
      >
        <View>
          <View
            style={{
              height: 240,
              width: 240,
            }}
          >
            <SkeletonLoader
              height={"100%"}
              width={"100%"}
              style={{
                borderRadius: 16
              }}
              backgroundColor='rgba(107, 107, 107, 0.3)'
              direction="leftToRight"
              animation='shiver'
            />
          </View>

          <View
            style={{
              height: 20,
              width: 240,
              marginTop: 12
            }}
          >
            <SkeletonLoader
              height={"100%"}
              width={"100%"}
              style={{
                borderRadius: 2
              }}
              backgroundColor='rgba(107, 107, 107, 0.3)'
              direction="leftToRight"
              animation='shiver'
            />
          </View>
        </View>

        <View>
          <View
            style={{
              height: 240,
              width: 240,
            }}
          >
            <SkeletonLoader
              height={"100%"}
              width={"100%"}
              style={{
                borderRadius: 16
              }}
              backgroundColor='rgba(107, 107, 107, 0.3)'
              direction="leftToRight"
              animation='shiver'
            />
          </View>

          <View
            style={{
              height: 20,
              width: 240,
              marginTop: 12
            }}
          >
            <SkeletonLoader
              height={"100%"}
              width={"100%"}
              style={{
                borderRadius: 2
              }}
              backgroundColor='rgba(107, 107, 107, 0.3)'
              direction="leftToRight"
              animation='shiver'
            />
          </View>
        </View>

        <View>
          <View
            style={{
              height: 240,
              width: 240,
            }}
          >
            <SkeletonLoader
              height={"100%"}
              width={"100%"}
              style={{
                borderRadius: 16
              }}
              backgroundColor='rgba(107, 107, 107, 0.3)'
              direction="leftToRight"
              animation='shiver'
            />
          </View>

          <View
            style={{
              height: 20,
              width: 240,
              marginTop: 12
            }}
          >
            <SkeletonLoader
              height={"100%"}
              width={"100%"}
              style={{
                borderRadius: 4
              }}
              backgroundColor='rgba(107, 107, 107, 0.3)'
              direction="leftToRight"
              animation='shiver'
            />
          </View>
        </View>
      </View>
    </View>
  )
}

export default SkeletonLoader;