import useModalStore from '@/store/useModalStore';
import { Cross } from 'lucide-react-native';
import { useEffect } from 'react';
import { View, Text, Dimensions, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming
} from 'react-native-reanimated';

const SCREEN_WIDTH = Dimensions.get("screen").width;

const CustomModal = () => {
  const { cutsomModal, setCustomModal } = useModalStore();

  const translateX = useSharedValue(SCREEN_WIDTH);

  useEffect(() => {
    if(cutsomModal) {
      translateX.value = withSpring(0, {damping: 15, stiffness: 100});
    } else {
      translateX.value = withTiming(-SCREEN_WIDTH, { duration: 300 }, () => {
        translateX.value = SCREEN_WIDTH;
      })
    }
    // eslint-disable-next-line
  }, [cutsomModal]);

  const modalStyle = useAnimatedStyle(() => {
    return {
      transform: [{
        translateX: translateX.value
      }]
    };
  });

  if(!cutsomModal && translateX.value === SCREEN_WIDTH) return null;

  return (
    <View
      style={{
        position: "absolute",
        right: 0,
        left: 0,
        top: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.4)",
        justifyContent: "flex-end",
        paddingBottom: 20
      }}
      pointerEvents={cutsomModal ? "auto" : "none"}
    >
      {/* Modal container */}
      <Animated.View
        style={[{
          width: 280,
          height: 400,
          backgroundColor: "white",
          alignSelf: "center",
          paddingTop: 12,
          gap: 32,
          paddingHorizontal: 12
        }, modalStyle]}
      >
        <View>
          <Pressable
            onPress={() => setCustomModal(false)}
          >
            <Cross size={22}/>
          </Pressable>
        </View>
        <View>
          <Text>
            This is testing modal
          </Text>
        </View>
      </Animated.View>
    </View>
  )
}

export default CustomModal;