import { View, Text, Pressable } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSpring } from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useEffect } from 'react';
import { scheduleOnRN } from 'react-native-worklets';
import useModalStore from '@/store/useModalStore';
import { style } from './CustomModal';
import { Delete, Edit } from 'lucide-react-native';
import usePlaylistStore from '@/store/usePlaylistStore';
import { Download, CloseIcon, Save, Share, Downloaded } from '@/Icons-assets/Icon';
import useDownloadStore from '@/store/useDownloadStore';
import DownloadEngine from '@/lib/DownloadEngine';
import API from '@/services/api';

const PlaylistBottomSheet = () => {
  const translateY = useSharedValue(0);
  const current = useSharedValue(0);

  const { playlistOpen, closePlaylistOptions, type } = useModalStore();

  const sheetHeight = type === "playlist" ? 236 : 500;

  useEffect(() => {
    if (playlistOpen) {
      translateY.value = withSpring(0, { damping: 20, stiffness: 200, overshootClamping: true })
    }
    else {
      translateY.value = withTiming(sheetHeight, { duration: 300 });
    }
    // eslint-disable-next-line
  }, [playlistOpen]);

  const handleClose = () => {
    translateY.value = withTiming(sheetHeight, { duration: 300 }, () => {
      scheduleOnRN(closePlaylistOptions)
    });
  };

  const pan = Gesture.Pan()
    .onBegin(() => {
      current.value = translateY.value
    })
    .onUpdate((event) => {
      translateY.value = Math.max(0, current.value + event.translationY);
    })
    .onEnd((event) => {
      if (translateY.value > sheetHeight * 0.3 || event.velocityY > 800) {
        translateY.value = withTiming(sheetHeight, { duration: 300 }, () => {
          scheduleOnRN(closePlaylistOptions)
        });
      }
      else {
        translateY.value = withTiming(0, { duration: 300 })
      }
    })

  const bottomSheetStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }]
    };
  });

  if (!playlistOpen) return;

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "flex-end",
        position: "absolute",
        right: 0,
        left: 0,
        top: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.4)",
        zIndex: 900
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
          }, bottomSheetStyle]}
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
            {/* <Cross size={22} strokeWidth={1.2}/> */}
            <CloseIcon size={24} strokeWidth={2} />
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

          {type === "playlist" ? <PlaylistModal /> : <EpisodeModal handleClose={handleClose} />}

        </Animated.View>
      </GestureDetector>

    </View>
  );
};

const PlaylistModal = () => {
  const { tappedPlaylist } = useModalStore();
  const { fetchPlaylists } = usePlaylistStore();

  return (
    <View>
      {/* Title */}
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
            {tappedPlaylist?.title}
            {/* Episode Title long long long */}
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
          style={[style.optionContainer]}
        >
          {/* icon */}
          <View
            style={style.iconContainer}
          >
            <Edit size={22} strokeWidth={1.8} />
          </View>

          {/* text */}
          <View
            style={[style.textContainer]}
          >
            <Text
              numberOfLines={1}
              style={style.text}
            >
              Edit
            </Text>
          </View>
        </Pressable>

        <Pressable
          onPress={() => { }}
          style={[style.optionContainer]}
        >
          {/* icon */}
          <View
            style={style.iconContainer}
          >
            <Delete size={22} strokeWidth={1.8} />
          </View>

          {/* text */}
          <View
            style={[style.textContainer, {
              borderBottomWidth: 0
            }]}
          >
            <Text
              numberOfLines={1}
              style={style.text}
            >
              Delete
            </Text>
          </View>
        </Pressable>


      </View>
    </View>
  );
};

const EpisodeModal = ({ handleClose }: { handleClose: () => void }) => {
  const { tappedEpisode, podcastId } = useModalStore();
  const {
    savePlaylist,
    SaveEpisodes,
    selectedPlaylist,
    fetchDPEpisodes,
    fetchSavedEpisodes
  } = usePlaylistStore();
  const { downloadEpisodes, tasks } = useDownloadStore();

  if (tappedEpisode) {
    const task = tasks[tappedEpisode.id] || { status: "IDLE", progress: 0 };
    const isHistoricallyDownladed = !!downloadEpisodes[tappedEpisode.id];

    const isSaved = SaveEpisodes.some((ep) => tappedEpisode.id === ep.id);

    const handleDownload = () => {
      switch (task.status) {
        case 'IDLE':
        case 'FAILED':
          DownloadEngine.enqueue(tappedEpisode, podcastId);
          break;

        case 'DOWNLOADING':
          DownloadEngine.cancel(tappedEpisode.id);
          break;
        case 'PAUSED':
          DownloadEngine.resume(tappedEpisode.id);
          break;
        case 'QUEUED':
        case 'COMPLETED':
          DownloadEngine.cancel(tappedEpisode.id);
          break;
      }

      if (isHistoricallyDownladed && task.status === 'IDLE') {
        DownloadEngine.cancel(tappedEpisode.id);
      };

      fetchDPEpisodes();
      handleClose();
    };

    const handleSave = async () => {
      if (isSaved) {
        await API.removeEpisode(savePlaylist?.id, tappedEpisode.episodeId);
      } else {
        const body = {
          podcastId: podcastId,
          episodeId: tappedEpisode.id,
          playlistId: savePlaylist?.id
        };

        await API.addEpisodeToPlaylist(body);
      };

      fetchSavedEpisodes();
      handleClose();
    };

    console.log("PodcastId:", podcastId);

    const handleRemovalFromPlaylist = async () => {
      if (selectedPlaylist) {
        await API.removeEpisode(selectedPlaylist.id, tappedEpisode.episodeId);
      }
      handleClose();
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

          <Pressable
            onPress={handleDownload}
            style={style.optionContainer}
          >
            {/* icon */}
            <View
              style={style.iconContainer}
            >
              {
                isHistoricallyDownladed
                  ? <Downloaded size={24} />
                  : <Download size={22} strokeWidth={1.8} />
              }
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
            style={style.optionContainer}
          >
            {/* icon */}
            <View
              style={style.iconContainer}
            >
              <Save size={22} strokeWidth={1.8} />
            </View>

            {/* text */}
            <View
              style={style.textContainer}
            >
              <Text
                numberOfLines={1}
                style={style.text}
              >
                Save
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

          {
            savePlaylist?.type === "custom"
              ? (
                <Pressable
                  onPress={handleRemovalFromPlaylist}
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
                      Remove From Playlist
                    </Text>
                  </View>
                </Pressable>
              )
              : (
                <Pressable
                  onPress={() => {
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
              )
          }



          <View
            style={[style.optionContainer]}
          >
            {/* icon */}
            <View
              style={style.iconContainer}
            >
              {/* <Save size={24} strokeWidth={1.8} /> */}
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
              {/* <Podcasts size={24} strokeWidth={1.8} /> */}
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
};

export default PlaylistBottomSheet;