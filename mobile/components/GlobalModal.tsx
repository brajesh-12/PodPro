import { View, Text, Modal, Pressable, Alert } from 'react-native'
import useModalStore from '@/store/useModalStore';
import { Share, X } from 'lucide-react-native';
import useSubscriptionStore from '@/store/useSubscriptionStore';
import usePlaylistStore from '@/store/usePlaylistStore';
import { useRouter } from 'expo-router';
import API from '@/services/api';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, interpolate, withTiming } from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { scheduleOnRN } from 'react-native-worklets';
import { useState } from 'react';

const GlobalModal = () => {
  // add states like episode, podcast and playlist in useModalStore.
  const { isOpen, closeGlobalModal, type, tappedPodcast } = useModalStore();
  const [modalHeight, setModalHeight] = useState(0);

  let podcastId = 0
  if (tappedPodcast) {
    podcastId = Number(tappedPodcast.id);
  }
  const { subscriptionIds, toggleSubscription } = useSubscriptionStore();
  const isSubscribed = subscriptionIds.has(podcastId);

  return (
    <Modal
      visible={isOpen}
      transparent={true}
      onRequestClose={() => closeGlobalModal()}
    >
      <View
        style={{
          flex: 1,
          position: "relative",
        }}
      >
        <Animated.View
          onLayout={(event) => {
            const { height } = event.nativeEvent.layout;
            setModalHeight(height);
          }}
          style={[{
            position: "absolute",
            backgroundColor: "yellow",
            right: 0,
            left: 0,
            bottom: 32,
          }]}
        >

          {/* Podcast Modal */}
          {type === "podcast" && (
            <Animated.View
              style={{
                // position: "absolute",
                backgroundColor: "white",
                paddingHorizontal: 12,
                paddingVertical: 8,
                height: "auto",
                borderRadius: 12
              }}
            >

              {/* title and close button */}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 12
                }}
              >
                <View>
                  <Text
                    style={{
                      fontFamily: "SF Pro",
                      fontSize: 18,
                      fontWeight: "600",
                      lineHeight: 28
                    }}
                  >{tappedPodcast?.title}</Text>

                  <Text
                    style={{
                      fontFamily: "SF Pro",
                      fontSize: 12,
                      fontWeight: "400",
                      lineHeight: 16
                    }}
                  >
                    {tappedPodcast?.artist}
                  </Text>
                </View>

                <Pressable
                  onPress={() => closeGlobalModal()}
                >
                  <X size={24} />
                </Pressable>
              </View>

              {/* options */}
              <View
                style={{
                  flexDirection: "column",
                  gap: 8
                }}
              >

                <Pressable
                  style={{
                    flexDirection: "row",
                    gap: 8,
                    alignItems: "center",
                    height: 40
                  }}
                >
                  <Share size={22} />

                  <Text>
                    Share
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() => toggleSubscription(podcastId)}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    height: 40
                  }}
                >
                  <Text>
                    {isSubscribed ? 'Unfollow' : "Follow"}
                  </Text>
                </Pressable>

                <Pressable
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    height: 40
                  }}
                >
                  <Text>
                    Turn on auto-download
                  </Text>
                </Pressable>
              </View>

            </Animated.View>
          )}

          {/* Episode Modal */}
          {type === "episode" && (<EpisodeModal />)}

          {/* Playlist Modal */}
          {type === "playlist" && (<PlaylistModal />)}
        </Animated.View>

      </View>
    </Modal>
  );
};

const EpisodeModal = () => {
  const { closeGlobalModal, setIsAddTo, tappedEpisode } = useModalStore();

  return (
    <View
      style={{
        position: "absolute",
        left: 12,
        right: 12,
        bottom: 32,
        backgroundColor: "white",
        paddingHorizontal: 12,
        paddingVertical: 8,
        height: 200,
        borderRadius: 12
      }}
    >
      {/* Title and close button */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          width: "100%"
        }}
      >
        <Text
          style={{
            fontFamily: "SF Pro",
            fontSize: 14,
            fontWeight: "500",
            lineHeight: 24
          }}
        >
          {tappedEpisode?.title}
        </Text>

        <Pressable
          onPress={() => closeGlobalModal()}
        >
          <X size={24} />
        </Pressable>
      </View>

      {/* Options */}
      <View>
        <Pressable
          onPress={() => {
            closeGlobalModal();
            setIsAddTo(true);
          }}
          style={{
            height: 40,
            justifyContent: "center"
          }}
        >
          <Text>
            Add to playlist
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

const PlaylistModal = () => {
  const router = useRouter();
  const { tappedPlaylist, closeGlobalModal } = useModalStore();
  const { fetchPlaylists } = usePlaylistStore();

  const handleDelete = async () => {
    if (tappedPlaylist) {
      await API.deletePlaylist(tappedPlaylist.id);
      fetchPlaylists();
      Alert.alert("Playlist Successfully Deleted");
    }
  }

  return (
    <View
      style={{
        position: "absolute",
        left: 12,
        right: 12,
        bottom: 32,
        backgroundColor: "white",
        paddingHorizontal: 12,
        paddingVertical: 8,
        height: 200,
        borderRadius: 12
      }}
    >
      {/* Title and close button */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between"
        }}
      >
        <Text
          style={{
            fontFamily: "SF Pro",
            fontSize: 14,
            fontWeight: "500",
            lineHeight: 24
          }}
        >
          {tappedPlaylist?.title}
        </Text>

        <Pressable
          onPress={() => closeGlobalModal()}
        >
          <X size={24} />
        </Pressable>
      </View>

      {/* Options */}

      {tappedPlaylist?.type === "custom" && (
        <View>
          <Pressable
            onPress={() => {
              handleDelete();
              closeGlobalModal();
            }}
            style={{
              height: 40,
              justifyContent: "center"
            }}
          >
            <Text>
              Delete Playlist
            </Text>
          </Pressable>

          <Pressable
            onPress={() => {
              closeGlobalModal();
              router.navigate({
                pathname: "/(tabs)/(library)/edit/[id]",
                params: { id: `${tappedPlaylist?.id}` }
              })
            }}
          >
            <Text>
              Edit Playlist
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  )
}

export default GlobalModal;