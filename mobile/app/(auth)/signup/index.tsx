import { View, Text, TouchableOpacity, TextInput, Pressable } from 'react-native'
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ChevronLeft } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useOnBoardingStore from '@/store/useOnBoardingStore';
import axios from 'axios';

const Signup = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const inputRef = useRef<TextInput>(null);

  const { email, setEmail, resetCredentials } = useOnBoardingStore();
  const [errorText, setErrorText] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 600);

    return () => clearTimeout(timer);
  }, []);

  const handleContinue = async () => {
    try {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(email)) {
        resetCredentials();
        setErrorText("Invalid email");
        return;
      }

      const response = await axios.post("http://localhost:3000/api/auth/email", {
        email: email
      });

      if (response.status === 200) {
        router.navigate({
          pathname: "/signup/password"
        });
      }

    } catch (error: any) {
      console.log("Error sending email:", error);

      resetCredentials();
      setErrorText(error.response.data?.message);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        paddingTop: insets.top
      }}
    >

      {/* header */}
      <View
        style={{
          height: 48,
          paddingHorizontal: 12,
          marginBottom: 8,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Pressable
          onPress={() => {
            resetCredentials();
            router.back();
          }}
          style={{
            position: "absolute",
            left: 8,
            height: 32,
            width: 32,
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <ChevronLeft size={24} strokeWidth={2} color={"white"} />
        </Pressable>

      </View>

      <View
        style={{
          paddingHorizontal: 20,
          marginBottom: 20,
          gap: 20
        }}
      >

        {/* Title */}
        <View
          style={{
            gap: 6
          }}
        >
          <Text
            style={{
              fontFamily: "SF Pro",
              fontWeight: "700",
              fontSize: 26,
              color: 'rgb(255, 255, 255)'
            }}
          >
            What&apos;s your email?
          </Text>

          <Text
            style={{
              fontFamily: "SF Pro",
              fontWeight: "500",
              fontSize: 14,
              color: "rgba(255, 255, 255, 0.6)"
            }}
          >
            To start, create a new account.
          </Text>
        </View>

        <View>
          {/* email input */}
          <View
            style={{
              height: 50,
              width: "100%",
              paddingLeft: 12,
              borderWidth: email.trim().length > 0 || errorText.trim().length > 0 ? 1.4 : 0,
              borderColor: errorText.length > 0 ? "rgb(251, 59, 59)" : 'rgba(255, 255, 255, 0.4)',
              justifyContent: "center",
              borderRadius: 8,
              backgroundColor: "rgb(26, 26, 26)"
            }}
          >
            <TextInput
              ref={inputRef}
              placeholder='Email'
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor={'rgba(255, 255, 255, 0.5)'}
              // autoFocus={true}
              style={{
                fontFamily: "SF Pro",
                fontSize: 15,
                color: 'rgb(255, 255, 255)'
              }}
            />
          </View>

          {/* Error Container */}
          <View
            style={{
              paddingTop: 6,
              opacity: errorText.trim().length > 0 ? 1 : 0,
            }}
          >
            <Text
              style={{
                fontFamily: "SF Pro",
                fontSize: 13,
                fontWeight: "600",
                color: "rgb(251, 59, 59)"
              }}
            >
              {errorText}
            </Text>
          </View>
        </View>

      </View>

      <View
        style={{
          // marginTop: 16,
          paddingHorizontal: 20
        }}
      >

        {/* Button */}
        <TouchableOpacity
          onPress={() => {
            if (email.trim().length > 0) {
              handleContinue();
            }
            return;
          }}
          style={{
            opacity: email.trim().length > 0 ? 1 : 0.5,
            height: 48,
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: email.trim().length > 0 ? "rgb(248, 216, 73)" : 'rgba(255, 255, 255, 0.5)',
            borderRadius: 32
          }}
        >
          <Text
            style={{
              fontFamily: "SF Pro",
              fontSize: 15,
              fontWeight: "500",
              color: "rgb(11, 11, 11)"
            }}
          >
            Continue
          </Text>
        </TouchableOpacity>

        <View
          style={{
            paddingVertical: 24,
            paddingHorizontal: 16
          }}
        >
          <Text
            style={{
              fontFamily: "SF Pro",
              fontWeight: "400",
              fontSize: 13,
              textAlign: "center",
              lineHeight: 18,
              color: 'rgba(255, 255, 255, 0.8)'
            }}
          >
            By signing up you agree to our <Text
              style={{
                fontWeight: "600",
                color: 'rgb(255, 255, 255)'
              }}
            >
              Privacy Policy and Terms of use.
            </Text>
          </Text>
        </View>
      </View>
    </View>
  );
};

export default Signup;