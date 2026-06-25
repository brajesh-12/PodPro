import { CloseIcon } from '@/Icons-assets/Icon';
import useAuthStore from '@/store/useAuthStore';
import useModalStore from '@/store/useModalStore';
import { useEffect, useState } from 'react';
import { View, Text, Dimensions, Pressable, TextInput } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

const { height: SCREEN_HEIGHT } = Dimensions.get("screen");

const ProfileScreenModal = () => {
  const { isDeleting, stopDeleting } = useModalStore();
  const { deleteAccount } = useAuthStore();
  const [ password, setPassword ] = useState("");

  const translateY = useSharedValue(0);
  const context = useSharedValue(0);

  const modalHeight = SCREEN_HEIGHT - 72;

  const handleClose = () => {
    translateY.value = withTiming(modalHeight, { duration: 250 }, () => {
      scheduleOnRN(setPassword, "");
      scheduleOnRN(stopDeleting);
    })
  };

  const handleDelete = () => {
    deleteAccount(password);
    handleClose();
  };

  useEffect(() => {
    if (isDeleting) {
      translateY.value = withSpring(0, { damping: 30, stiffness: 200, overshootClamping: true });
    }
    else {
      translateY.value = withTiming(modalHeight, { duration: 250 })
    }
    // eslint-disable-next-line
  }, [isDeleting]);

  const pan = Gesture.Pan()
    .onBegin(() => {
      context.value = translateY.value;
    })
    .onUpdate((event) => {
      translateY.value = Math.max(0, event.translationY + context.value);
    })
    .onEnd((event) => {
      if (translateY.value > modalHeight * 0.3 || event.velocityY > 800) {
        translateY.value = withTiming(modalHeight, { duration: 250 }, () => {
          scheduleOnRN(setPassword, "");
          scheduleOnRN(stopDeleting);
        })
      }
      else {
        translateY.value = withTiming(0, { duration: 300 });
      }
    });

  const modalStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }]
    };
  });

  if (!isDeleting) return null;

  return (
    <View
      style={{
        position: "absolute",
        top: 0,
        right: 0,
        left: 0,
        bottom: 0,
        zIndex: 950,
        backgroundColor: "rgba(0, 0, 0, 0.2)",
        justifyContent: "flex-end"
      }}
    >
      {/* Modal */}
      <GestureDetector
        gesture={pan}
      >
        <Animated.View
          style={[{
            height: modalHeight,
            backgroundColor: 'white',
            width: "100%",
            borderTopLeftRadius: 44,
            borderTopRightRadius: 44
          }, modalStyle]}
        >
          {/* close button */}
          <View
            style={{
              width: "100%",
              alignItems: "flex-end",
              // backgroundColor: "yellow",
              paddingHorizontal: 20,
              paddingVertical: 20
            }}
          >
            <Pressable
              onPress={() => {
                handleClose();
              }}
              style={{
                backgroundColor: "white",
                borderRadius: 60,
                height: 48,
                width: 48,
                justifyContent: "center",
                alignItems: "center",

                shadowColor: "rgb(0, 0, 0)",
                shadowOpacity: 0.15,
                shadowRadius: 6,
                shadowOffset: {
                  height: 2,
                  width: 2
                }
              }}
            >
              <CloseIcon size={28} strokeWidth={2}/>
            </Pressable>
          </View>


          <View>
            {/* title */}
            <View
              style={{
                paddingHorizontal: 18,
                paddingBottom: 16
              }}
            >
              <Text
                style={{
                  fontFamily: "SF Pro",
                  fontWeight: "700",
                  fontSize: 28,
                  lineHeight: 32,
                  textAlign: "center"
                }}
              >
                Are you sure you want to delete your account?
              </Text>
            </View>

            {/* subTitle */}
            <View
              style={{
                paddingHorizontal: 26,
              }}
            >
              <Text
                style={{
                  fontFamily: "SF Pro",
                  fontWeight: "400",
                  fontSize: 18,
                  lineHeight: 24,
                  textAlign: "center",
                  color: "rgb(113, 113, 113)"
                }}
              >
                Once you delete your account, all data related to it will be lost forever. Please enter your password below to continue.
              </Text>
            </View>
          </View>

          {/* Input container */}
          <View
            style={{
              paddingHorizontal: 20,
              paddingVertical: 40
            }}
          >
            <View
              style={{
                height: 48,
                borderRadius: 32,
                backgroundColor: "rgba(0, 0, 0, 0.1)",
                paddingLeft: 12
              }}
            >
              <TextInput
                value={password}
                onChangeText={setPassword}
                autoFocus={true}
                style={{
                  height: "100%",
                  width: "100%",
                  fontFamily: "SF Pro",
                  fontSize: 17,
                  fontWeight: "500",
                }}
              />
            </View>

            <Pressable
              onPress={() => {
                handleDelete();
              }}
              style={{
                height: 48,
                borderRadius: 32,
                backgroundColor: "rgba(255, 0, 0, 0.12)",
                justifyContent: "center",
                alignItems: "center",
                marginTop: 32
              }}
            >
              <Text
                style={{
                  fontFamily: "SF Pro",
                  fontSize: 17,
                  fontWeight: "500",
                  lineHeight: 24,
                  color: "red"
                }}
              >
                Delete
              </Text>
            </Pressable>
          </View>
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

export default ProfileScreenModal;