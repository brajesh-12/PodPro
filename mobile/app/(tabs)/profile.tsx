import { View, Text, Pressable, Alert, ScrollView, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import useAuthStore from '@/store/useAuthStore'
// import { useNetworkStore } from '@/store/useNetworkStore';
import { Image } from 'expo-image';
import * as imagePicker from 'expo-image-picker';
import UP_API from '@/services/updateAPI';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CameraIcon, ChevronRight } from 'lucide-react-native';
import useModalStore from '@/store/useModalStore';

const ProfileScreen = () => {
  const insets = useSafeAreaInsets();
  const { logout } = useAuthStore();
  // const { toggleDebugOffline, isOnline } = useNetworkStore();
  const { user, setUser } = useAuthStore();
  const { startDelete } = useModalStore();

  const [image, setImage] = useState<string | null>(null);

  const handleProfilePic = async () => {
    const updatedUser = await UP_API.updateProfilePic(image);
    setUser(updatedUser);
  }

  const pickImage = async () => {
    const permissionResult = await imagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permission Required", "Permission to access the media is required ");
      return;
    }

    let result = await imagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      handleProfilePic();
    }
  };

  const handleLogOut = () => {
    Alert.alert("Are you sure you want to log out?",
      "When logged out, you cannot access your saved shows or favourite shows. You'll need to log back in to access your content.",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Log out",
          onPress: () => {
            logout();
          },
          style: "destructive"
        }
      ]
    )
  };

  return (
    <View
      style={{
        flex: 1
      }}
    >

      {/* Header */}
      <View
        style={{
          position: "absolute",
          top: insets.top,
          height: 48,
          width: "100%",
          justifyContent: "center",
          alignItems: "flex-start",
          paddingHorizontal: 20,
          zIndex: 50
        }}
      >
        <View>
          <Text
            style={{
              fontFamily: "SF Pro",
              fontSize: 22,
              lineHeight: 28,
              fontWeight: "700"
            }}
          >
            Profile
          </Text>
        </View>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        bounces={false}
        style={{
          paddingTop: insets.top + 48,
        }}
        contentContainerStyle={{
          paddingBottom: 200 
        }}
      >

        <View
          style={{
            width: "100%",
            paddingHorizontal: 20,
            paddingTop: 32,
            paddingBottom: 48,
            alignItems: "center",
            // backgroundColor: "yellow"
          }}
        >
          <View
            style={{
              flexGrow: 0,
              height: 72,
              width: 72,
            }}
          >
            <Pressable
              onPress={pickImage}
              style={{
                height: 72,
                width: 72,
                backgroundColor: "rgb(200, 200, 200)",
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

            <Pressable
              style={{
                height: 24,
                width: 24,
                borderRadius: 32,
                justifyContent: "center",
                alignItems: "center",
                position: "absolute",
                bottom: 2,
                right: -5,
                backgroundColor: "black"
              }}
            >
              <CameraIcon size={12} strokeWidth={1.2} color={"white"} />
            </Pressable>
          </View>

          <View
            style={{
              gap: 12,
              marginTop: 6,
              alignItems: "center"
            }}
          >
            <View>
              <Text
                style={{
                  fontFamily: "SF Pro",
                  fontWeight: "700",
                  lineHeight: 22,
                  fontSize: 15
                }}
              >
                UserName
              </Text>
            </View>

            <Pressable
              style={{
                paddingVertical: 8,
                paddingHorizontal: 16,
                backgroundColor: "white",
                borderRadius: 32
              }}
            >
              <Text
                style={{
                  fontFamily: "SF Pro",
                  fontWeight: "400",
                  lineHeight: 22,
                  fontSize: 15
                }}
              >
                Edit Name
              </Text>
            </Pressable>
          </View>

        </View>

        <View
          style={{
            paddingHorizontal: 20,
            paddingBottom: 32
          }}
        >
          <View
            style={{
              borderRadius: 28,
              backgroundColor: "white",
              paddingHorizontal: 16
            }}
          >
            <View
              style={{
                height: 52,
                width: "100%",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text
                style={{
                  fontFamily: "SF Pro",
                  fontSize: 17,
                  fontWeight: "400",
                  lineHeight: 22
                }}
              >
                Downloads
              </Text>

              <ChevronRight size={18} strokeWidth={1.5} />
            </View>

            <View
              style={{
                height: 52,
                width: "100%",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                borderTopWidth: 1,
                borderTopColor: "rgb(200, 200, 200)"
              }}
            >
              <Text
                style={{
                  fontFamily: "SF Pro",
                  fontSize: 17,
                  fontWeight: "400",
                  lineHeight: 22
                }}
              >
                Save Playlists
              </Text>

              <ChevronRight size={18} strokeWidth={1.5} />
            </View>

          </View>
        </View>

        <View
          style={{
            paddingHorizontal: 20,
            paddingBottom: 32
          }}
        >
          <View
            style={{
              borderRadius: 28,
              backgroundColor: "white",
              paddingHorizontal: 16
            }}
          >
            <View
              style={{
                height: 52,
                width: "100%",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text
                style={{
                  fontFamily: "SF Pro",
                  fontSize: 17,
                  fontWeight: "400",
                  lineHeight: 22
                }}
              >
                Terms and conditions
              </Text>

              <ChevronRight size={18} strokeWidth={1.5} />
            </View>

            <View
              style={{
                height: 52,
                width: "100%",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                borderTopWidth: 1,
                borderTopColor: "rgb(200, 200, 200)"
              }}
            >
              <Text
                style={{
                  fontFamily: "SF Pro",
                  fontSize: 17,
                  fontWeight: "400",
                  lineHeight: 22
                }}
              >
                Data control
              </Text>
            </View>

            <View
              style={{
                height: 52,
                width: "100%",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                borderTopWidth: 1,
                borderTopColor: "rgb(200, 200, 200)"
              }}
            >
              <Text
                style={{
                  fontFamily: "SF Pro",
                  fontSize: 17,
                  fontWeight: "400",
                  lineHeight: 22
                }}
              >
                Privacy Policy
              </Text>

              <ChevronRight size={18} strokeWidth={1.5} />
            </View>

          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          onPress={() => handleLogOut()}
          style={{
            paddingHorizontal: 20,
            paddingBottom: 32,
            width: "100%"
          }}
        >
          <View
            style={{
              borderRadius: 28,
              backgroundColor: "white",
              paddingHorizontal: 16
            }}
          >
            <View
              style={{
                height: 52,
                width: "100%",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text
                style={{
                  fontFamily: "SF Pro",
                  fontSize: 17,
                  fontWeight: "400",
                  lineHeight: 22,
                  color: "rgb(28, 152, 223)"
                }}
              >
                Log out
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Delete Account */}
        <View
          style={{
            paddingHorizontal: 20,
            paddingBottom: 32,
            width: "100%"
          }}
        >
          <TouchableOpacity
            onPress={() => {
              startDelete()
            }}
            style={{
              borderRadius: 28,
              backgroundColor: "white",
              paddingHorizontal: 16
            }}
          >
            <View
              style={{
                height: 52,
                width: "100%",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text
                style={{
                  fontFamily: "SF Pro",
                  fontSize: 17,
                  fontWeight: "400",
                  lineHeight: 22,
                  color: "rgb(230, 55, 39)"
                }}
              >
                Delete Account
              </Text>
            </View>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </View>
  );
};

export default ProfileScreen;