import { View, Text, TouchableOpacity, FlatList, Pressable, Modal, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import usePlaylistStore from '@/store/usePlaylistStore';
import { ArrowLeft, EllipsisVertical, Download, Play, X, Edit } from 'lucide-react-native';
import { Image } from 'expo-image';
import { formatDate, formatDuration } from '@/lib/utils';
import SafeArea from '@/components/SafeArea';
import { SavedEpisode } from '@/store/useSubscriptionStore';
import API from '@/services/api';
import * as imagePicker from 'expo-image-picker';
import UP_API from '@/services/updateAPI';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { useAnimatedScrollHandler, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';

const HEADER_HEIGHT = 48;

const SelectedPlaylist = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const insets = useSafeAreaInsets();
  const translateY = useSharedValue(0);

  const [triggerPoint, setTriggerPoint] = useState(0);

  const [tappedEpisode, setTappedEpisode] = useState<SavedEpisode | null>(null);
  const [modalVisibile, setModalVisible] = useState(false);
  const [image, setImage] = useState<string | null>(null);

  const { singlePlaylist, selectedPlaylist, fetchEpisodes, playlistEpisodes } = usePlaylistStore();

  const handleRemove = async (playlistId: any, eId: any) => {
    const response = await API.removeEpisode(playlistId, eId);
    if (response?.data.status === 500) {
      Alert.alert("Error", "Something went wrong.");
      return;
    }

    const message = response?.data?.message;
    Alert.alert(`${message}`);
    setModalVisible(false);
    fetchEpisodes(id);
  }

  const handleImageUpdate = async () => {
    await UP_API.updatePlaylistCover(id, image);
    singlePlaylist(id);
  }

  const pickImage = async () => {
    const permissionResult = await imagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permission required", "Permission to access the media is required.");
      return
    }

    let result = await imagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1
    });

    console.log("Image result:", result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      handleImageUpdate();
    }
  }

  useEffect(() => {
    singlePlaylist(id);
    fetchEpisodes(id);
    // eslint-disable-next-line
  }, []);

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      translateY.value = event.contentOffset.y;
    }
  });

  const headerStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: translateY.value > triggerPoint ? 'rgba(242, 242, 242, 1)' : 'rgba(242, 242, 242, 0)'
    };
  });

  return (

    <View
      style={{
        paddingTop: insets.top
      }}
    >
      {/* Header */}
      <Animated.View
        style={[{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          height: HEADER_HEIGHT,
          paddingLeft: 12,
          paddingRight: 8,
          position: "absolute",
          top: insets.top,
          right: 0,
          left: 0,
          zIndex: 20
        }, headerStyle]}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            alignItems: "center",
            justifyContent: "center",
            height: 36,
            width: 36,
            borderRadius: 72
          }}
        >
          <ArrowLeft size={24} strokeWidth={2} />
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            alignItems: "center",
            justifyContent: "center",
            height: 36,
            width: 36,
            borderRadius: 72
          }}
        >
          <EllipsisVertical size={24} strokeWidth={2} />
        </TouchableOpacity>
      </Animated.View>

      <Animated.ScrollView
        bounces={false}
        style={{
          paddingTop: HEADER_HEIGHT
        }}
        onScroll={onScroll}
      >

        {/* Top container */}
        <View
          onLayout={(event) => {
            const { height } = event.nativeEvent.layout;
            setTriggerPoint(height);
          }}
        >
          {/* Thumbnail */}
          <View
            style={{
              paddingVertical: 12,
              alignItems: "center"
            }}
          >
            <View
              style={{
                height: 204,
                width: 204,
                backgroundColor: "grey",
                borderRadius: 4,
                position: "relative",
              }}
            >
              <Image
                style={{
                  height: "100%",
                  width: "100%",
                  borderRadius: 6
                }}
                source={{ uri: selectedPlaylist?.image }}
              />

              {/* edit button */}
              {
                selectedPlaylist?.type === "custom" && (
                  <Pressable
                    onPress={() => {
                      pickImage();
                    }}
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      height: 54,
                      width: 54,
                      position: "absolute",
                      right: -8,
                      bottom: -8,
                      backgroundColor: "white",
                      borderRadius: 64
                    }}
                  >
                    <Edit size={22} />
                  </Pressable>
                )
              }

            </View>
          </View>

          {/* Title  */}
          <View
            style={{
              gap: 6,
              width: "100%",
              paddingVertical: 16,
              alignItems: "center"
            }}
          >
            <Text
              style={{
                fontFamily: "SF Pro",
                fontSize: 24,
                fontWeight: "800",
                lineHeight: 32,
                textAlign: "center"
              }}
            >
              {selectedPlaylist?.title}
            </Text>

            <Text
              style={{
                fontFamily: "SF Pro",
                fontSize: 12,
                fontWeight: "400",
                lineHeight: 16,
                color: "grey",
                textAlign: "center"
              }}
            >
              {formatDate(selectedPlaylist?.createdAt)}
            </Text>
          </View>

          {/* CTA Buttons */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 12,
              gap: 16
            }}
          >

            <View
              style={{
                height: 44,
                width: 44,
                borderRadius: 88,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "rgb(217, 217, 217)"
              }}
            >
              <Download size={22} strokeWidth={2} />
            </View>



            <TouchableOpacity
              style={{
                height: 64,
                width: 64,
                borderRadius: 128,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "rgb(217, 217, 217)"
              }}
            >
              <Play size={22} strokeWidth={2} fill={"black"} />
            </TouchableOpacity>

            <View
              style={{
                height: 44,
                width: 44,
                borderRadius: 88,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "rgb(217, 217, 217)"
              }}
            >
              <EllipsisVertical size={22} strokeWidth={2} />
            </View>

          </View>
        </View>

        <FlatList
          scrollEnabled={false}
          data={playlistEpisodes}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{
            paddingBottom: 180
          }}
          renderItem={({ item }) => {
            return (
              <View
                style={{
                  flexDirection: "row",
                  paddingLeft: 16,
                  paddingRight: 10,
                  paddingBottom: 12,
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 12,
                  width: 393
                }}
              >
                {/* left container */}
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 12,
                    flexShrink: 1
                  }}
                >
                  {/* image */}
                  <View
                    style={{
                      height: 64,
                      width: 64,
                    }}
                  >
                    <Image
                      source={{ uri: item.image }}
                      style={{
                        height: "100%",
                        width: "100%",
                        borderRadius: 4
                      }}
                    />
                  </View>

                  {/* title container */}
                  <View
                    style={{
                      gap: 4,
                      flexShrink: 1,
                      width: "auto"
                    }}
                  >
                    <Text
                      numberOfLines={1}
                      ellipsizeMode='tail'
                      style={{
                        fontFamily: "SF Pro",
                        fontSize: 16,
                        fontWeight: "500",
                        lineHeight: 24,
                        width: "auto"
                      }}
                    >
                      {item.title}
                    </Text>

                    <Text
                      numberOfLines={1}
                      ellipsizeMode='tail'
                      style={{
                        fontFamily: "SF Pro",
                        fontSize: 14,
                        fontWeight: "400",
                        lineHeight: 20
                      }}
                    >
                      {formatDuration(item.duration)} &#183; {item.podcastTitle}
                    </Text>
                  </View>
                </View>

                <View>
                  <Pressable
                    onPress={() => {
                      setModalVisible(true);
                      setTappedEpisode(item);
                    }}
                    style={{
                      height: 30,
                      width: 30,
                      justifyContent: "center",
                      alignContent: "center"
                    }}
                  >
                    <EllipsisVertical size={20} />
                  </Pressable>
                </View>
              </View>
            )
          }}
        />

      </Animated.ScrollView>

      <Modal
        visible={modalVisibile}
        onRequestClose={() => setModalVisible(false)}
        transparent={true}
      >
        <SafeArea>
          <View
            style={{
              flex: 1,
              position: "relative",
              paddingHorizontal: 12
            }}
          >
            {/* modal card */}
            <View
              style={{
                position: "absolute",
                right: 12,
                left: 12,
                bottom: 32,
                backgroundColor: "white",
                paddingHorizontal: 12,
                borderRadius: 12,
              }}
            >
              {/* title container */}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingVertical: 8,
                  gap: 12
                }}
              >
                <Text
                  numberOfLines={1}
                  ellipsizeMode='tail'
                  style={{
                    fontFamily: "SF Pro",
                    fontSize: 18,
                    fontWeight: "600",
                    lineHeight: 28,
                    flex: 1
                  }}
                >
                  {tappedEpisode?.title}
                </Text>

                <Pressable
                  onPress={() => setModalVisible(false)}
                  style={{
                    height: 30,
                    width: 30,
                    justifyContent: "center",
                    alignItems: "center",
                    flexShrink: 0
                  }}
                >
                  <X size={20} />
                </Pressable>
              </View>

              <View>
                <Pressable
                  onPress={() => {
                    handleRemove(id, tappedEpisode?.episodeId);
                  }}
                  style={{
                    height: 40,
                    justifyContent: 'center'
                  }}
                >
                  <Text>
                    Remove from playlist
                  </Text>
                </Pressable>
              </View>

            </View>
          </View>

        </SafeArea>
      </Modal>
    </View>

  )
}

export default SelectedPlaylist;