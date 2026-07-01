import { View, Text, TouchableOpacity, TextInput, Pressable } from 'react-native'
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useAuthStore from '@/store/useAuthStore';

const CreateUserName = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const inputRef = useRef<TextInput>(null);

  const [ userName, setUserName ] = useState("");

  const { toggleAuthorization } = useAuthStore();

  useEffect(() => {
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 500);

    return () => clearTimeout(timer);
  }, []);

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
          marginBottom: 24,
          alignItems: "flex-end",
          justifyContent: "center",
        }}
      >

        <Pressable
          onPress={toggleAuthorization}
          style={{
            paddingVertical: 8,
            paddingHorizontal: 16,
            backgroundColor: "white",
            borderRadius: 32,
            shadowColor: "rgb(0, 0, 0)",
            shadowOpacity: 0.12,
            shadowRadius: 16,
            shadowOffset: {
              height: 1,
              width: 1
            }
          }}
        >
          <Text
            style={{
              fontFamily: "SF Pro",
              fontSize: 14,
              fontWeight: "400"
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
            What should we call you?
          </Text>
        </View>

        {/* Email Input */}
        <View
          style={{
            height: 50,
            width: "100%",
            paddingLeft: 12,
            paddingRight: 12,
            borderWidth: 1,
            alignItems: "center",
            borderRadius: 8,
            flexDirection: "row"
          }}
        >
          <View
            style={{
              flex: 1
            }}
          >
            <TextInput
              ref={inputRef}
              value={userName}
              onChangeText={setUserName}
              autoCapitalize="none"
              // autoFocus={true}
              style={{
                fontFamily: "SF Pro",
                fontSize: 15
              }}
            />
          </View>

        </View>

        <Text
          style={{
            fontFamily: "SF Pro",
            fontSize: 12,
            fontWeight: "400"
          }}
        >
          This appear on your Podpro profile.
        </Text>

      </View>

      <View
        style={{
          marginTop: 20,
          paddingHorizontal: 20
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
  );
};

export default CreateUserName;