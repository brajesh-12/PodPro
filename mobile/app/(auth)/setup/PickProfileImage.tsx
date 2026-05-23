import { View, Text, Pressable, Dimensions } from 'react-native'
import React, { useState } from 'react'
import useAuthStore from '@/store/useAuthStore'
import { useRouter } from 'expo-router';
import { Avatars } from '@/constants/avatars';
import { Image } from 'expo-image';
import Animated, { interpolate, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue, Extrapolation } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import UP_API from '@/services/updateAPI';


const screenWidth = Dimensions.get("screen").width;
const itemWidth = screenWidth * 0.5;
const spacing = 12;

const CarouselItem = ({ imageUri, index, scrollx, }: { imageUri: any, index: number, scrollx: any }) => {
  const scaling = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: interpolate(
            scrollx.value,
            [index - 1, index, index + 1],
            [0.78, 1.1, 0.78],
            Extrapolation.CLAMP
          )
        }
      ]
    }
  });

  return (
    <Animated.View
      style={[{
        height: itemWidth,
        width: itemWidth,
        borderRadius: itemWidth / 2,
        justifyContent: "center",
        overflow: "hidden"
      }, scaling]}
    >
      <Image
        style={{
          flex: 1
        }}
        source={imageUri.local}
      />
    </Animated.View>
  );
};

const PickProfileImage = () => {
  const { toggleAuthorization } = useAuthStore();
  const router = useRouter();
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollx = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler((e) => {
    scrollx.value = e.contentOffset.x / (itemWidth + spacing);
    const newIndex = Math.round(scrollx.value);

    if (selectedIndex !== newIndex) {
      scheduleOnRN(setSelectedIndex, newIndex);
    }
  });

  const handleSubmit = async () => {
    const selectedAvatar = Avatars[selectedIndex];
    await UP_API.updateProfilePic(selectedAvatar.remote);
  }

  return (
    <View
      style={{
        flex: 1
      }}
    >
      {/* header */}
      <View
        style={{
          height: 48,
          width: "100%",
          paddingHorizontal: 16,
          justifyContent: "center",
          alignItems: "flex-end"
        }}
      >
        <Pressable
          onPress={() => {
            handleSubmit();
            router.navigate({
              pathname: '/(auth)/setup/PickUserName'
            });
          }}
          style={{
            paddingHorizontal: 16,
            paddingVertical: 8,
            backgroundColor: "grey",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 32
          }}
        >
          <Text>
            Next
          </Text>
        </Pressable>
      </View>

      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <Animated.FlatList
          style={{
            backgroundColor: "red"
          }}
          contentContainerStyle={{
            paddingHorizontal: (screenWidth - itemWidth) / 2,
            gap: spacing,
            alignItems: "center"
          }}
          data={Avatars}
          keyExtractor={(_, index) => String(index)}
          renderItem={({ item, index }) => <CarouselItem imageUri={item} index={index} scrollx={scrollx} />}
          onScroll={onScroll}
          scrollEventThrottle={16}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          snapToInterval={itemWidth + spacing}
          decelerationRate={"fast"}
        />
      </View>

      <Pressable
        onPress={() => toggleAuthorization()}
        style={{
          position: "absolute",
          bottom: 80,
          left: 16,
          paddingHorizontal: 24,
          paddingVertical: 12,
          backgroundColor: "grey",
          borderRadius: 32
        }}
      >
        <Text>
          FINISH PROFILE LATER
        </Text>
      </Pressable>
    </View>
  )
}

export default PickProfileImage;