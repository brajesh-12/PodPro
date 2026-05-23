import { View, Text, Pressable, Alert } from 'react-native'
import React, { useState } from 'react'
import useAuthStore from '@/store/useAuthStore'
import { useNetworkStore } from '@/store/useNetworkStore';
import { Image } from 'expo-image';
import * as imagePicker from 'expo-image-picker';
import UP_API from '@/services/updateAPI';

const ProfileScreen = () => {
  const {logout} = useAuthStore();
  const { toggleDebugOffline, isOnline } = useNetworkStore();
  const { user, setUser } = useAuthStore();

  const [ image, setImage ] = useState<string | null>(null);

  const handleProfilePic = async () => {
    const updatedUser = await UP_API.updateProfilePic(image);
    setUser(updatedUser);
  }

  const pickImage = async () => {
    const permissionResult = await imagePicker.requestMediaLibraryPermissionsAsync();
    if(!permissionResult.granted) {
      Alert.alert("Permission Required", "Permission to access the media is required ");
      return;
    }

    let result = await imagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1
    });

    if(!result.canceled) {
      setImage(result.assets[0].uri);
      handleProfilePic();
    }
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 12
      }}
    >
      <View>
        <Pressable
          onPress={pickImage}
          style={{
            height: 100,
            width: 100,
            backgroundColor: "grey",
            borderRadius: 50,
            overflow: "hidden"
          }}
        >
          <Image
            style={{
              height: '100%',
              width: '100%',
            }}
            source={{ uri: user?.profilePic }}
          />
        </Pressable>
      </View>

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

      <Pressable
        onPress={toggleDebugOffline}
        style={{
          backgroundColor: isOnline ? 'blue' : 'grey',
          height:  40,
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: 16,
        }}
      >
        <Text
          style={{
            color: isOnline ? 'white' : "black",
          }}
        >
          Toggle Network
        </Text>
      </Pressable>
    </View>
  )
}

export default ProfileScreen;