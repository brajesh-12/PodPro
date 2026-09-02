import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { View, Text, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const WelcomeScreen = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "flex-start",
        backgroundColor: "black",
        paddingTop: insets.top
      }}
    >
      <LinearGradient
        colors={['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 1)']}
        start={{x: 0, y: 0.9}}
        end={{x: 0, y: 0.3}}
        style={{
          position: "absolute",
          right: 0,
          left: 0,
          top: 0,
          height: 200,
          zIndex: 10
        }}
      />
      <View
        style={{
          height: 480,
          width: 500
        }}
      >
        <Image
          style={{
            height: "100%",
            width: "100%"
          }}
          contentFit="cover"
          source={require("../../assets/images/podcasts.png")}
        />
      </View>
      {/* container */}
      <LinearGradient
        colors={['rgba(0, 0, 0, 0.3)', 'rgba(0, 0, 0, 1)']}
        start={{ x: 0, y: 0.2 }}
        end={{ x: 0, y: 0.62 }}
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          right: 0,
          left: 0
        }}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "flex-end",
            paddingBottom: 48
          }}
        >
          <View>
            <View
              style={{
                marginBottom: 32
              }}
            >
              <Text
                style={{
                  fontFamily: "SF Pro",
                  fontSize: 34,
                  fontWeight: "700",
                  lineHeight: 38,
                  textAlign: "center",
                  color: 'white'
                }}
              >
                Science, fiction and many more in just a few taps
              </Text>
            </View>

            <View
              style={{
                paddingHorizontal: 16,
                gap: 12
              }}
            >
              <Pressable
                style={{
                  paddingVertical: 14,
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                  backgroundColor: "rgb(248, 216, 73)",
                  borderRadius: 32,
                }}
                onPress={() => {
                  router.navigate({
                    pathname: "/signup"
                  });
                }}
              >
                <Text
                  style={{
                    fontFamily: "SF Pro",
                    fontWeight: "500",
                    lineHeight: 20,
                    color: "black",
                    fontSize: 14
                  }}
                >
                  GET STARTED
                </Text>
              </Pressable>

              <Pressable
                style={{
                  paddingVertical: 14,
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                  borderWidth: 1,
                  borderRadius: 32,
                  borderColor: "white"
                }}
                onPress={() => {
                  router.navigate({
                    pathname: "/signin"
                  });
                }}
              >
                <Text
                  style={{
                    fontFamily: "SF Pro",
                    fontWeight: "500",
                    lineHeight: 20,
                    color: "white",
                    fontSize: 14
                  }}
                >
                  SIGN IN
                </Text>
              </Pressable>

            </View>
          </View>
        </View>
      </LinearGradient>
    </View>
  )
}

export default WelcomeScreen;