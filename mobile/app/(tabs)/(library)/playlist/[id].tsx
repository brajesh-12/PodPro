import { View, Text, TouchableOpacity, FlatList, Pressable, Alert, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import usePlaylistStore from '@/store/usePlaylistStore';
import { EllipsisVertical, Download, Play, ChevronLeft } from 'lucide-react-native';
import { Image } from 'expo-image';
import { formatDate, formatDuration } from '@/lib/utils';
import API from '@/services/api';
import * as imagePicker from 'expo-image-picker';
import UP_API from '@/services/updateAPI';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { useAnimatedScrollHandler, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import useModalStore from '@/store/useModalStore';
import { BlurView } from 'expo-blur';
import { EditIcon, Share } from '@/Icons-assets/Icon';

const HEADER_HEIGHT = 48;

const SelectedPlaylist = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const insets = useSafeAreaInsets();
  const translateY = useSharedValue(0);

  const [triggerPoint, setTriggerPoint] = useState(0);
  const [image, setImage] = useState<string | null>(null);

  const { singlePlaylist, selectedPlaylist, fetchEpisodes, playlistEpisodes } = usePlaylistStore();
  const { setTappedEpisode, openPlaylistOptions, setPodcastId } = useModalStore();

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
          onPress={() => {
            router.back();
          }}
          style={{
            height: 48,
            width: 48,
            borderRadius: 24,
            alignItems: "center",
            shadowOpacity: 0.12,
            shadowColor: "rgb(0, 0, 0)",
            shadowOffset: {
              height: 2,
              width: 1,
            },
            shadowRadius: 8,
            overflow: "hidden",
          }}
        >
          <BlurView
            intensity={18}
            style={StyleSheet.absoluteFill}
          />
          <View
            style={[StyleSheet.absoluteFill, {
              justifyContent: "center",
              paddingLeft: 8,

              borderTopWidth: 0.6,
              borderBottomWidth: 0.6,
              borderRightWidth: 0.8,
              borderLeftWidth: 0.8,
              borderRadius: 24,
              borderTopColor: 'rgba(255, 255, 255, 0.7)',
              borderBottomColor: "rgba(255, 255, 255, 0.7)",
              borderLeftColor: "rgba(255, 255, 255, 0.8)",
              borderRightColor: "rgba(255, 255, 255, 0.8)"
            }]}
          >
            <ChevronLeft size={26} color={'rgb(255, 255, 255)'} />
          </View>
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
                position: "relative",
              }}
            >
              <Image
                style={{
                  height: "100%",
                  width: "100%",
                  borderRadius: 8
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
                      height: 40,
                      width: 40,
                      position: "absolute",
                      right: 2,
                      bottom: 2,
                      backgroundColor: "rgba(11, 11, 11, 0.6)",
                      borderRadius: 64
                    }}
                  >
                    <EditIcon size={22} color='rgb(255, 255, 255)' />
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
              alignItems: "center",
              marginBottom: 12
            }}
          >
            <Text
              style={{
                fontFamily: "SF Pro",
                fontSize: 24,
                fontWeight: "800",
                lineHeight: 32,
                textAlign: "center",
                color: 'rgb(255, 255, 255)'
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
                color: "rgba(255, 255, 255, 0.6)",
                textAlign: "center",
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
              justifyContent: "space-between",
              marginBottom: 12,
              gap: 16,
              paddingHorizontal: 20
            }}
          >
            <View
              style={{
                height: 50,
                width: 50,
                paddingRight: 4,
                borderRadius: 88,
                justifyContent: "center",
                alignItems: "center",

                backgroundColor: "rgb(255, 255, 255, 0.04)",
                borderTopWidth: 0.2,
                borderBottomWidth: 0.2,
                borderLeftWidth: 1,
                borderRightWidth: 1,
                borderTopColor: "rgba(255, 255, 255, 0.8)",
                borderBottomColor: "rgba(255, 255, 255, 0.8)",
                borderLeftColor: "rgba(255, 255, 255, 0.9)",
                borderRightColor: "rgba(255, 255, 255, 0.9)"
              }}
            >
              <Share size={22} color='rgb(255, 255, 255)' />
            </View>

            <View
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                borderRadius: 88,
                flexDirection: "row",
                paddingLeft: 4,
                borderTopWidth: 0.8,
                borderBottomWidth: 0.8,
                borderLeftWidth: 0.6,
                borderRightWidth: 0.6,
                borderTopColor: "rgba(255, 255, 255, 0.9)",
                borderBottomColor: "rgba(255, 255, 255, 0.9)",
                borderLeftColor: "rgba(255, 255, 255, 0.8)",
                borderRightColor: "rgba(255, 255, 255, 0.8)"
              }}
            >
              <View
                style={{
                  height: 50,
                  width: 48,
                  borderRadius: 88,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Share size={22} color='rgb(255, 255, 255)' />
              </View>

              <View
                style={{
                  height: 50,
                  width: 50,
                  borderRadius: 88,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Download size={22} strokeWidth={2} color={'rgb(255, 255, 255)'} />
              </View>

              <View
                style={{
                  height: 50,
                  width: 48,
                  borderRadius: 88,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <EllipsisVertical size={22} strokeWidth={2} color={'rgb(255, 255, 255)'} />
              </View>
            </View>

            <TouchableOpacity
              style={{
                height: 50,
                width: 50,
                borderRadius: 128,
                justifyContent: "center",
                alignItems: "center",

                backgroundColor: "rgb(255, 255, 255, 0.04)",
                borderTopWidth: 0.2,
                borderBottomWidth: 0.2,
                borderLeftWidth: 1,
                borderRightWidth: 1,
                borderTopColor: "rgba(255, 255, 255, 0.8)",
                borderBottomColor: "rgba(255, 255, 255, 0.8)",
                borderLeftColor: "rgba(255, 255, 255, 0.9)",
                borderRightColor: "rgba(255, 255, 255, 0.9)"
              }}
            >
              <Play size={24} strokeWidth={2} fill={"rgb(255, 255, 255)"} color={"none"} />
            </TouchableOpacity>

          </View>
        </View>

        <FlatList
          scrollEnabled={false}
          data={playlistEpisodes}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{
            paddingBottom: 180,
            paddingTop: 16
          }}
          renderItem={({ item }) => {

            const getPodcastId = async () => {
              const podcast = await API.getPodcastFromDocId(item.podcastId);
              return podcast.id
            };

            const handlePress = async () => {
              setTappedEpisode(item);
              openPlaylistOptions("episode");

              const id = await getPodcastId();
              if (id != null) {
                setPodcastId(id);
              }
            };

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
                      height: 56,
                      width: 56,
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
                        width: "auto",
                        color: 'rgba(255, 255, 255, 1)'
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
                        lineHeight: 20,
                        color: "rgba(255, 255, 255, 0.8)"
                      }}
                    >
                      {formatDuration(item.duration)} &#183; {item.podcastTitle}
                    </Text>
                  </View>
                </View>

                <View>
                  <Pressable
                    onPress={handlePress}
                    style={{
                      height: 30,
                      width: 30,
                      justifyContent: "center",
                      alignContent: "center"
                    }}
                  >
                    <EllipsisVertical size={20} color={'rgb(255, 255, 255)'} />
                  </Pressable>
                </View>
              </View>
            )
          }}

        />

      </Animated.ScrollView>
    </View>

  );
};

export default SelectedPlaylist;