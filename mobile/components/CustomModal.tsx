import useModalStore from '@/store/useModalStore';
import { Play } from 'lucide-react-native';
import { useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, Alert } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { scheduleOnRN } from 'react-native-worklets';
import { CloseIcon, Download, Follow, Podcasts, Save, Share, Unfollow } from '@/Icons-assets/Icon';
import useSubscriptionStore from '@/store/useSubscriptionStore';
import useDownloadStore from '@/store/useDownloadStore';
import usePlaylistStore from '@/store/usePlaylistStore';
import API from '@/services/api';
import usePlayerStore from '@/store/usePlayerStore';

// const { height: SCREEN_HEIGHT } = Dimensions.get("screen");
// const sheetHeight = SCREEN_HEIGHT * 0.5;

const CustomModal = () => {
  const { closeModal, isVisible, type } = useModalStore();

  const height = type === 'episode' ? 517 : 310;

  const translateY = useSharedValue(height);
  const context = useSharedValue(0);

  const handleClose = () => {
    translateY.value = withTiming(height, { duration: 300 }, () => {
      scheduleOnRN(closeModal);
    });
  };

  useEffect(() => {
    if (isVisible) {
      translateY.value = withSpring(0, { damping: 20, stiffness: 200, overshootClamping: true });
    }
    else {
      translateY.value = withTiming(height, { duration: 300 });
    }
    // eslint-disable-next-line
  }, [isVisible]);

  const pan = Gesture.Pan()
    .onStart(() => {
      context.value = translateY.value
    })
    .onUpdate((event) => {
      translateY.value = Math.max(0, context.value + event.translationY);
    })
    .onEnd((event) => {
      if (translateY.value > height * 0.3 || event.velocityY > 800) {
        translateY.value = withTiming(height, { duration: 250 }, () => {
          scheduleOnRN(closeModal);
        });
      }
      else {
        translateY.value = withTiming(0, { duration: 300 });
      }
    })

  const modalStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }]
    };
  });

  if (!isVisible) return;

  return (
    <View
      style={{
        position: "absolute",
        right: 0,
        left: 0,
        top: 0,
        bottom: 0,
        zIndex: 999,
        justifyContent: "flex-end",
        backgroundColor: "rgba(0, 0, 0, 0.3)"
      }}
    >
      <GestureDetector
        gesture={pan}
      >
        <Animated.View
          style={[{
            width: "100%",
            backgroundColor: "white",
            borderTopLeftRadius: 36,
            borderTopRightRadius: 36,
            overflow: "hidden",
            paddingHorizontal: 20,
            paddingBottom: 32
          }, modalStyle]}
        >
          <Pressable
            onPress={() => {
              handleClose();
            }}
            style={{
              position: "absolute",
              top: 12,
              right: 12,
              height: 44,
              width: 44,
              backgroundColor: "white",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 24,
              zIndex: 12,
              shadowOffset: {
                height: 4,
                width: -3
              },
              shadowColor: "rgb(0, 0, 0)",
              shadowOpacity: 0.18,
              shadowRadius: 8,

              elevation: 5
            }}
          >
            <CloseIcon size={24} strokeWidth={2}/>
            {/* <ClosedCaptionIcon size={20} strokeWidth={1.2} /> */}
          </Pressable>

          <View
            style={{
              height: 12,
              width: "100%",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <View
              style={{
                height: 5,
                width: 36,
                borderRadius: 32,
                backgroundColor: "rgb(137, 137, 137)"
              }}
            />
          </View>

          {type === "podcast"
            ? <PodcastSheet />
            : <EpisodeSheet handleClose={handleClose} />
          }

        </Animated.View>
      </GestureDetector>
    </View>
  );
};

export default CustomModal;

const PodcastSheet = () => {
  const { tappedPodcast } = useModalStore();

  let podcastId = 0
  if (tappedPodcast) {
    podcastId = Number(tappedPodcast.id);
  }
  const { subscriptionIds, toggleSubscription } = useSubscriptionStore();
  const isSubscribed = subscriptionIds.has(podcastId);

  return (
    <View>
      {/* title */}
      <View
        style={{
          marginBottom: 16,
          paddingHorizontal: 4,
          justifyContent: "center",
          // backgroundColor: "yellow"
        }}
      >
        <View
          style={{
            justifyContent: "center",
            borderBottomWidth: 0.8,
            borderBottomColor: "rgb(221, 221, 221)",
            paddingVertical: 12,
            paddingRight: 32,
            paddingLeft: 4
          }}
        >
          <Text
            numberOfLines={1}
            style={{
              fontFamily: "SF Pro",
              fontSize: 24,
              fontWeight: "600",
              lineHeight: 32
            }}
          >
            {tappedPodcast?.title}
          </Text>

          <Text
            numberOfLines={1}
            style={{
              fontFamily: "SF Pro",
              fontSize: 16,
              fontWeight: "400",
              lineHeight: 24
            }}
          >
            {tappedPodcast?.artist}
          </Text>
        </View>

      </View>

      {/* options */}
      <View
        style={{
          backgroundColor: 'rgb(236, 236, 236)',
          borderRadius: 26,
          marginTop: 12
        }}
      >
        <Pressable
          onPress={() => toggleSubscription(podcastId)}
          style={style.optionContainer}
        >
          {/* icon */}
          <View
            style={style.iconContainer}
          >
            {isSubscribed ? <Unfollow size={22} strokeWidth={1.8}/> : <Follow size={22} strokeWidth={1.8}/>}
          </View>

          {/* text */}
          <View
            style={style.textContainer}
          >
            <Text
              numberOfLines={1}
              style={style.text}
            >
              {isSubscribed ? "Unfollow" : "Follow"}
            </Text>
          </View>
        </Pressable>

        <View
          style={style.optionContainer}
        >
          {/* icon */}
          <View
            style={style.iconContainer}
          >
            <Download size={22} strokeWidth={1.8} />
          </View>

          {/* text */}
          <View
            style={style.textContainer}
          >
            <Text
              numberOfLines={1}
              style={style.text}
            >
              Turn on auto-download
            </Text>
          </View>
        </View>

        <View
          style={style.optionContainer}
        >
          {/* icon */}
          <View
            style={style.iconContainer}
          >
            <Share size={22} strokeWidth={1.8} />
          </View>

          {/* text */}
          <View
            style={[style.textContainer, { borderBottomWidth: 0 }]}
          >
            <Text
              numberOfLines={1}
              style={style.text}
            >
              Share
            </Text>
          </View>
        </View>

      </View>
    </View>
  )
};

const EpisodeSheet = ({ handleClose }: { handleClose: () => void }) => {
  const { tappedEpisode, openPlaylistSelection, podcastId } = useModalStore();
  const { startDownload, removeDownload, downloadEpisodes } = useDownloadStore();
  const { downloadPlaylist, SaveEpisodes, savePlaylist, fetchSavedEpisodes } = usePlaylistStore();
  const { setActiveEpisode } = usePlayerStore();

  console.log("PodcastId From Episode:", podcastId);

  const handleDownload = async () => {
    if (tappedEpisode) {
      if (!downloadEpisodes[tappedEpisode.id]) {
        if (!podcastId || !downloadPlaylist?.id) {
          return Alert.alert("Something went wrong");
        }

        await startDownload(tappedEpisode, podcastId);
      }
      else {
        await removeDownload(tappedEpisode.id, tappedEpisode.episodeId);
      }
    };
  };

  const isSaved = SaveEpisodes.some((ep) => tappedEpisode?.id === ep.id);

  const handleSave = async () => {
    if(isSaved) {
      await API.removeEpisode(savePlaylist?.id, tappedEpisode?.episodeId);
      fetchSavedEpisodes();
    }
    else {
      const body = {
        podcastId: podcastId,
        episodeId: tappedEpisode?.id,
        playlistId: savePlaylist?.id
      };

      await API.addEpisodeToPlaylist(body);
      fetchSavedEpisodes();
    };
  };

  return (
    <View>
      {/* title */}
      <View
        style={{
          marginBottom: 16,
          paddingHorizontal: 4,
          justifyContent: "center",
          // backgroundColor: "yellow"
        }}
      >
        <View
          style={{
            justifyContent: "center",
            borderBottomWidth: 1,
            borderBottomColor: "rgb(221, 221, 221)",
            paddingVertical: 12,
            paddingRight: 32,
            paddingLeft: 4
          }}
        >
          <Text
            numberOfLines={1}
            style={{
              fontFamily: "SF Pro",
              fontSize: 24,
              fontWeight: "600",
              lineHeight: 32
            }}
          >
            {tappedEpisode?.title}
            {/* Episode Title long long long */}
          </Text>

          <Text
            numberOfLines={1}
            style={{
              fontFamily: "SF Pro",
              fontSize: 16,
              fontWeight: "400",
              lineHeight: 24
            }}
          >
            {tappedEpisode?.podcastTitle}
            {/* Podcast Artist */}
          </Text>
        </View>

      </View>

      {/* options */}
      <View
        style={{
          backgroundColor: 'rgb(236, 236, 236)',
          borderRadius: 26,
          marginTop: 12
        }}
      >
        <View
          style={style.optionContainer}
        >
          {/* icon */}
          <View
            style={style.iconContainer}
          >
            <Share size={24} strokeWidth={1.8} />
          </View>

          {/* text */}
          <View
            style={style.textContainer}
          >
            <Text
              numberOfLines={1}
              style={style.text}
            >
              Share
            </Text>
          </View>
        </View>

        <Pressable
          onPress={() => {
            setActiveEpisode(tappedEpisode);
            handleClose();
          }}
          style={style.optionContainer}
        >
          {/* icon */}
          <View
            style={style.iconContainer}
          >
            <Play size={22} strokeWidth={1.8} />
          </View>

          {/* text */}
          <View
            style={style.textContainer}
          >
            <Text
              numberOfLines={1}
              style={style.text}
            >
              Play
            </Text>
          </View>
        </Pressable>

        <Pressable
          onPress={() => {
            handleDownload();
          }}
          style={style.optionContainer}
        >
          {/* icon */}
          <View
            style={style.iconContainer}
          >
            <Download size={22} strokeWidth={1.8} />
          </View>

          {/* text */}
          <View
            style={style.textContainer}
          >
            <Text
              numberOfLines={1}
              style={style.text}
            >
              Download
            </Text>
          </View>
        </Pressable>

        <Pressable
          onPress={() => {
            handleSave();
          }}
          style={[style.optionContainer]}
        >
          {/* icon */}
          <View
            style={style.iconContainer}
          >
            <Save size={24} strokeWidth={1.8} fill={isSaved? 'black' : "none"}/>
          </View>

          {/* text */}
          <View
            style={[style.textContainer]}
          >
            <Text
              numberOfLines={1}
              style={style.text}
            >
              {isSaved ? "Remove from Save" : "Save"}
            </Text>
          </View>
        </Pressable>

        <Pressable
          onPress={() => {
            handleClose();
            openPlaylistSelection();
          }}
          style={[style.optionContainer]}
        >
          {/* icon */}
          <View
            style={style.iconContainer}
          >
            <Save size={24} strokeWidth={1.8} />
          </View>

          {/* text */}
          <View
            style={[style.textContainer]}
          >
            <Text
              numberOfLines={1}
              style={style.text}
            >
              Save To Playlist
            </Text>
          </View>
        </Pressable>

        <View
          style={[style.optionContainer]}
        >
          {/* icon */}
          <View
            style={style.iconContainer}
          >
            <Save size={24} strokeWidth={1.8} />
          </View>

          {/* text */}
          <View
            style={[style.textContainer]}
          >
            <Text
              numberOfLines={1}
              style={style.text}
            >
              Go To Episode
            </Text>
          </View>
        </View>

        <View
          style={[style.optionContainer]}
        >
          {/* icon */}
          <View
            style={style.iconContainer}
          >
            <Podcasts size={24} strokeWidth={1.8} />
          </View>

          {/* text */}
          <View
            style={[style.textContainer, { borderBottomWidth: 0 }]}
          >
            <Text
              numberOfLines={1}
              style={style.text}
            >
              Go To Podcast
            </Text>
          </View>
        </View>

      </View>
    </View>
  );
};

export const style = StyleSheet.create({
  optionContainer: {
    // flex: 1,
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 14,
    paddingRight: 11
  },
  text: {
    fontWeight: "400",
    fontFamily: "SF Pro",
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: 0
  },
  textContainer: {
    height: "100%",
    flex: 1,
    borderBottomWidth: 0.5,
    borderBottomColor: "rgb(211, 211, 211)",
    justifyContent: "center",
  },
  iconContainer: {
    height: 44,
    width: 44,
    justifyContent: "center",
    alignItems: "center"
  },
  testStyle: {
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: 14,
    paddingRight: 11,
    borderRadius: 24,
    backgroundColor: "rgb(223, 223, 223)"
  }
});