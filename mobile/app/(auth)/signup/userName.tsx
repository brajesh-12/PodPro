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
                fontWeight: "500",
                color: 'rgb(255, 255, 255)'
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
                fontSize: 26,
                color: 'rgb(255, 255, 255)'
              }}
            >
              What Should we call your?
            </Text>

            <Text
              style={{
                fontFamily: "SF Pro",
                fontWeight: "500",
                fontSize: 14,
                color: "rgba(255, 255, 255, 0.8)"
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
                borderColor: 'rgba(255, 255, 255, 0.4)',
                justifyContent: "center",
                borderRadius: 8,
                backgroundColor: "rgb(26, 26, 26)"
              }}
            >
              <TextInput
                ref={inputRef}
                placeholder='Your name'
                value={userName}
                onChangeText={setUserName}
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
              height: 48,
              width: "100%",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: userName.trim().length > 0 ? "rgb(248, 216, 73)" : 'rgba(255, 255, 255, 0.5)',
              borderRadius: 32
            }}
          // onPress={handleSignup}
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
    </KeyboardAvoidingView>

  );
};

export default CreateUserName;