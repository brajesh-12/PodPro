import { View, Text, TouchableOpacity, TextInput, Alert, Pressable } from 'react-native'
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, EyeOff, Eye } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useOnBoardingStore from '@/store/useOnBoardingStore';
import axios from 'axios';
import useAuthStore from '@/store/useAuthStore';
import * as secureStorage from 'expo-secure-store';

const Login = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const inputRef = useRef<TextInput>(null);

  const { email, setEmail, password, setPassword, resetCredentials } = useOnBoardingStore();
  const { setAuth, toggleAuthorization } = useAuthStore();

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [secure, setVisibility] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 600);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (emailError.length > 0 || passwordError.length > 0) {
      const resetError = setTimeout(() => {
        setEmailError("");
        setPasswordError("");
      }, 3000);
      return () => clearTimeout(resetError);
    }
  }, [emailError, passwordError]);

  const handleContinue = async () => {
    try {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!email || !password) {
        resetCredentials();
        setEmailError("Please provide your email");
        setPassword("Please provide a password");
        return;
      }
      else if (!emailRegex.test(email)) {
        resetCredentials();
        setEmailError("Invalid Email");
        return;
      }
      else if (password.length < 0) {
        resetCredentials();
        setPasswordError("");
        return;
      }

      const response = await axios.post('http://localhost:3000/api/auth/login', {
        email,
        password
      });
      const data = response.data;

      setAuth(data.user, data.tokens.accessToken);
      await secureStorage.setItemAsync("refreshToken", data.tokens.refreshToken);

      resetCredentials();
      toggleAuthorization();

    } catch (error: any) {
      console.log("Error logging in:", error);
      Alert.alert(
        "Error",
        error.response.data.message
      );
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
          gap: 16
        }}
      >
        {/* Title */}
        <View
          style={{
            gap: 4
          }}
        >
          <Text
            style={{
              fontFamily: "SF Pro",
              fontWeight: "700",
              fontSize: 26,
              color: "rgb(255, 255, 255)"
            }}
          >
            Welcome back
          </Text>

          <Text
            style={{
              fontFamily: "SF Pro",
              fontWeight: "500",
              fontSize: 14,
              color: "rgba(255, 255, 255, 0.7)"
            }}
          >
            {email.length > 0 ? 'Enter your password to sign in' : 'Enter your email address'}
          </Text>
        </View>

        <View
          style={{
            paddingVertical: 12,
          }}
        >
          {/* Email Input */}
          <View
            style={{
              marginBottom: emailError.trim().length > 0 ? 16 : -4
            }}
          >
            <View
              style={{
                height: 50,
                width: "100%",
                paddingLeft: 12,
                borderWidth: email.trim().length > 0 || emailError.trim().length > 0 ? 1.5 : 0,
                borderColor: emailError.length > 0 ? "rgb(251, 59, 59)" : 'rgba(255, 255, 255, 0.4)',
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
                opacity: emailError.trim().length > 0 ? 1 : 0,
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
                {emailError}
              </Text>
            </View>
          </View>

          <View>
            {/* Password Input */}
            <View
              style={{
                height: 50,
                width: "100%",
                paddingLeft: 12,
                paddingRight: 12,
                borderWidth: password.length > 0 || passwordError.length > 0 ? 1.5 : 0,
                borderColor: "rgba(255, 255, 255, 0.4)",
                alignItems: "center",
                borderRadius: 8,
                flexDirection: "row",
                backgroundColor: "rgb(26, 26, 26)"
              }}
            >
              <View
                style={{
                  flex: 1
                }}
              >
                <TextInput
                  placeholder='Password'
                  value={password}
                  onChangeText={setPassword}
                  autoCapitalize="none"
                  secureTextEntry={secure}
                  placeholderTextColor={'rgba(255, 255, 255, 0.5)'}
                  // autoFocus={true}
                  style={{
                    fontFamily: "SF Pro",
                    fontSize: 15,
                    color: 'rgb(255, 255, 255)'
                  }}
                />
              </View>

              <Pressable
                onPress={() => {
                  setVisibility(!secure);
                }}
              >
                {secure ? <EyeOff size={22} color={'rgb(255, 255, 255)'} /> : <Eye size={22} color={'rgb(255, 255, 255)'} />}
              </Pressable>

            </View>

            <View
              style={{
                paddingTop: 6,
                opacity: passwordError.length > 0 ? 1 : 0
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
                Password Should have atleast 6 characters.
              </Text>


            </View>
          </View>
        </View>

      </View>

      <View
        style={{
          marginTop: 16,
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
            height: 48,
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor:  email.trim().length > 0 && password.length > 0 ? "rgb(248, 216, 73)" : 'rgba(255, 255, 255, 0.5)',
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
      </View>
    </View>
  );
};

export default Login;