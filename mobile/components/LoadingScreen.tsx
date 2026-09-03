import { View } from 'react-native';
import LottieView from 'lottie-react-native';

const LoadingScreen = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <View>
        <LottieView
          source={require('@/assets/micro-animation/loadingAnimation.json')}
          style={{
            height: 44,
            width: 44
          }}
          colorFilters={[
            {
              keypath: "*",
              color: 'rgb(255, 255, 255)'
            }
          ]}
          loop={true}
          autoPlay={true}
        />
      </View>
    </View>
  )
}

export default LoadingScreen;