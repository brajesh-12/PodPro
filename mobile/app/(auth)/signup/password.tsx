import { View, Text, TouchableOpacity, TextInput, Alert, Pressable } from 'react-native'
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import useAuthStore from '@/store/useAuthStore';
import axios from 'axios';
import * as secureStorage from 'expo-secure-store';
import { ChevronLeft, Eye, EyeOff } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useOnBoardingStore from '@/store/useOnBoardingStore';

const CreatePasswordScreen = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const inputRef = useRef<TextInput>(null);

  const [secure, setVisibility] = useState(true);
  const [errorText, setErrorText] = useState("");

  const { setAuth } = useAuthStore();
  const { email, password, setPassword, resetCredentials } = useOnBoardingStore();

  useEffect(() => {
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleSignup = async () => {
    try {
      if (password.length < 6) {
        setPassword("");
        setErrorText("Must have at least 6 characters");
        return;
      }

      const response = await axios.post('http://localhost:3000/api/auth/signup', {
        email,
        password,
      });

      const data = response.data;

      setAuth(data.user, data.tokens.accessToken);
      await secureStorage.setItemAsync('refreshToken', data.tokens.refreshToken);

      resetCredentials();
      router.navigate({
        pathname: '/signup/userName'
      });

    } catch (error: any) {
      console.log("Error signing up:", error);
      if (error.response?.status === 400) {
        resetCredentials();
        return Alert.alert("Error", error.response.data?.message);
      } else if (error.message) {
        resetCredentials();
        return Alert.alert("Error", error.message);
      }
      else {
        resetCredentials();
       return Alert.alert("Error", "An unexpected system error occurred");
      }
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
          onPress={() => router.back()}
          style={{
            position: "absolute",
            left: 8,
            height: 32,
            width: 32,
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <ChevronLeft size={24} strokeWidth={2} />
        </Pressable>

      </View>

      <View
        style={{
          paddingHorizontal: 20,
          marginBottom: 20,
          gap: 12
        }}
      >

        {/* Title */}
        <View>
          <Text
            style={{
              fontFamily: "SF Pro",
              fontWeight: "700",
              fontSize: 26
            }}
          >
            Set a password
          </Text>
        </View>

        <View
          style={{
            paddingTop: 8
          }}
        >
          {/* Password Input */}
          <View
            style={{
              height: 50,
              width: "100%",
              paddingLeft: 12,
              paddingRight: 12,
              borderWidth: password.length > 0 || errorText.length > 0 ? 1.5 : 0,
              borderColor: errorText.length > 0 ? "rgb(251, 59, 59)" : "black",
              alignItems: "center",
              borderRadius: 8,
              flexDirection: "row",
              backgroundColor: "rgb(226, 226, 226)"
            }}
          >
            <View
              style={{
                flex: 1
              }}
            >
              <TextInput
                ref={inputRef}
                placeholder='Password'
                value={password}
                onChangeText={setPassword}
                autoCapitalize="none"
                secureTextEntry={secure}
                // autoFocus={true}
                style={{
                  fontFamily: "SF Pro",
                  fontSize: 15
                }}
              />
            </View>

            <Pressable
              onPress={() => {
                setVisibility(!secure);
              }}
            >
              {secure ? <EyeOff size={22} /> : <Eye size={22} />}
            </Pressable>

          </View>

          <View
            style={{
              paddingTop: 6,
              opacity: 1,
            }}
          >
            <Text
              style={{
                fontFamily: "SF Pro",
                fontSize: 12,
                fontWeight: "500",
                color: errorText.length > 0 ? "rgb(251, 59, 59)" : "black"
              }}
            >
              {errorText.length > 0 ? errorText : "Must have at least 6 characters"}
            </Text>


          </View>
        </View>

      </View>

      <View
        style={{
          marginTop: 20,
          paddingHorizontal: 20
        }}
      >
        {/* Button */}
        <TouchableOpacity
          onPress={() => {
            if (password.length > 0) {
              handleSignup();
            }
            return;
          }}
          style={{
            opacity: password.length > 0 ? 1 : 0.5,
            height: 48,
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "black",
            borderRadius: 32
          }}
        // onPress={handleSignup}
        >
          <Text
            style={{
              fontFamily: "SF Pro",
              fontSize: 15,
              fontWeight: "500",
              color: "white"
            }}
          >
            Continue
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CreatePasswordScreen;