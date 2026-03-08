import { View, Text, Pressable } from 'react-native'
import React from 'react'
import useAuthStore from '@/store/useAuthStore'

const ProfileScreen = () => {
  const {logout} = useAuthStore();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <Pressable
        onPress={logout}
        style={{
          height: 40,
          width: 200,
          paddingHorizontal: 16,
          backgroundColor: "red",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <Text
          style={{
            fontFamily: "SF Pro",
            fontWeight: "500",
            fontSize: 14,
            color: "white"
          }}
        >
          Logout
        </Text>
      </Pressable>
    </View>
  )
}

export default ProfileScreen;