import { View, Text, TouchableOpacity, TextInput, Alert, Pressable } from 'react-native'
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ChevronLeft } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useOnBoardingStore from '@/store/useOnBoardingStore';
import { CloseIcon } from '@/Icons-assets/Icon';

const Signup = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const inputRef = useRef<TextInput>(null);

  const { email, setEmail } = useOnBoardingStore();
  const [ errorText, setErrorText ] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 600);

    return () => clearTimeout(timer);
  }, []);

  const handleContinue = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setEmail("");
      return Alert.alert(
        "Inavlid Email",
        "Email address is invalid. Please try with different email."
      );
    }
    router.navigate({
      pathname: "/signup/password"
    });
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
          marginBottom: 16,
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

        <View
          style={{
            height: "100%",
            flex: 1,
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <Text
            style={{
              fontFamily: "SF Pro",
              fontSize: 16,
              fontWeight: "700"
            }}
          >
            Create account
          </Text>
        </View>

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
              fontSize: 24
            }}
          >
            What&apos;s your email?
          </Text>
        </View>

        <View>
          {/* Email Input */}
          <View
            style={{
              height: 50,
              width: "100%",
              paddingLeft: 12,
              borderWidth: 1,
              justifyContent: "center",
              borderRadius: 8
            }}
          >
            <TextInput
              ref={inputRef}
              placeholder='Email'
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              // autoFocus={true}
              style={{
                fontFamily: "SF Pro",
                fontSize: 15
              }}
            />
          </View>

          {/* Error display */}
          <View
            style={{
              paddingTop: 12,
              opacity: 1,
              flexDirection: "row",
              alignItems: "center",
              gap: 6
            }}
          >
            <View
              style={{
                height: 22,
                width: 22,
                borderRadius: 32,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "red"
              }}
            >
              <CloseIcon size={14} color="rgb(255, 255, 255)" />
            </View>
            <Text
              style={{
                fontFamily: "SF Pro",
                fontSize: 14,
                fontWeight: "500",
                color: "rgb(242, 34, 34)"
              }}
            >
              {errorText}
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
            backgroundColor: "black",
            borderRadius: 32
          }}
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

export default Signup;