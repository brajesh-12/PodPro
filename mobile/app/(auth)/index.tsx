import { useRouter } from 'expo-router';
import { View, Text, Pressable } from 'react-native';

const WelcomeScreen = () => {
  const router = useRouter();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "flex-end",
        paddingBottom: 32,
        backgroundColor: "black"
      }}
    >
      {/* container */}
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
  )
}

export default WelcomeScreen;