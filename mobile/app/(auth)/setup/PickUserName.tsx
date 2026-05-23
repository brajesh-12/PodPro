import { View, Text, Pressable, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import useAuthStore from '@/store/useAuthStore';
import UP_API from '@/services/updateAPI';

const PickUserName = () => {
  const router = useRouter();
  const [ userName, setUserName ] = useState("");

  const { toggleAuthorization, setUser } = useAuthStore();

  const handleUsername = async() => {
    const updatedUser = await UP_API.updateName(userName);
    setUser(updatedUser);
    toggleAuthorization();
  }

  return (
    <View
      style={{
        flex: 1
      }}
    >
      {/* header */}
      <View
        style={{
          height: 44,
          width: "100%",
          paddingHorizontal: 16,
          alignItems: "center",
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 48
        }}
      >
        <Pressable
          style={{
            height: 40,
            width: 100,
            paddingHorizontal: 12,
            justifyContent: 'center',
            alignItems: "center",
            backgroundColor: "grey",
          }}
          onPress={() => router.back()}
        >
          <Text>
            Back
          </Text>
        </Pressable>

        <Pressable
          onPress={handleUsername}
          style={{
            paddingHorizontal: 16,
            paddingVertical: 8,
            backgroundColor: "grey",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <Text>
            Next
          </Text>
        </Pressable>
      </View>

      <View
        style={{
          paddingHorizontal: 16,
          gap: 102
        }}
      >
        <Text
          style={{
            fontFamily: "SF Pro",
            fontSize: 32,
            fontWeight: "600",
            lineHeight: 38
          }}
        >
          What should we call you?
        </Text>
        <TextInput
          value={userName}
          onChangeText={setUserName}
          style={{
            borderBottomWidth: 1,
            fontFamily: "SF Pro",
            fontSize: 32,
            fontWeight: "600",
            lineHeight: 38
          }}
        />
      </View>
    </View>
  )
}

export default PickUserName;