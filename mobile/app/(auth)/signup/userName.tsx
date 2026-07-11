import { View, Text, TouchableOpacity, TextInput, Pressable, KeyboardAvoidingView, Platform } from 'react-native'
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useAuthStore from '@/store/useAuthStore';

const CreateUserName = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const inputRef = useRef<TextInput>(null);

  const [userName, setUserName] = useState("");

  const { toggleAuthorization } = useAuthStore();

  useEffect(() => {
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS ==='ios' ? 'padding' : 'height'}
      style={{
        flex: 1
      }}
    >
      <View
        style={{
          flex: 1,
          paddingTop: insets.top
        }}
      >
        <View
          style={{
            height: 48,
            paddingHorizontal: 12,
            alignItems: "flex-end",
            justifyContent: "center",
            marginBottom: 8
          }}
        >

          <Pressable
            onPress={toggleAuthorization}
            style={{
              paddingVertical: 8,
              paddingHorizontal: 16,
            }}
          >
            <Text
              style={{
                fontFamily: "SF Pro",
                fontSize: 14,
                fontWeight: "500"
              }}
            >
              Skip
            </Text>
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
              gap: 6
            }}
          >
            <Text
              style={{
                fontFamily: "SF Pro",
                fontWeight: "700",
                fontSize: 26
              }}
            >
              What Should we call your?
            </Text>

            <Text
              style={{
                fontFamily: "SF Pro",
                fontWeight: "500",
                fontSize: 14,
                color: "rgba(0, 0, 0, 0.6)"
              }}
            >
              Will display on your profile.
            </Text>
          </View>

          <View>
            <View
              style={{
                height: 50,
                width: "100%",
                paddingLeft: 12,
                borderWidth: userName.length > 0 ? 1.4 : 0,
                borderColor: 'black',
                justifyContent: "center",
                borderRadius: 8,
                backgroundColor: "rgb(226, 226, 226)"
              }}
            >
              <TextInput
                ref={inputRef}
                placeholder='Your name'
                value={userName}
                onChangeText={setUserName}
                keyboardType="email-address"
                autoCapitalize="none"
                // autoFocus={true}
                style={{
                  fontFamily: "SF Pro",
                  fontSize: 15,
                }}
              />
            </View>
          </View>
        </View>

        <View
          style={{
            flex: 1,
            marginTop: 16,
            paddingHorizontal: 20,
            justifyContent: "flex-end",
            paddingBottom: 32
          }}
        >
          {/* Button */}
          <TouchableOpacity
            onPress={() => router.navigate({
              pathname: "/signup/userName"
            })}
            style={{
              opacity: userName.trim().length > 0 ? 1 : 0.5,
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
    </KeyboardAvoidingView>

  );
};

export default CreateUserName;