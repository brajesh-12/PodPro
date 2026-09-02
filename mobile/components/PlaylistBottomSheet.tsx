import { View, Text, Pressable, TouchableOpacity, Alert } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSpring } from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useEffect } from 'react';
import { scheduleOnRN } from 'react-native-worklets';
import useModalStore from '@/store/useModalStore';
import { style } from './CustomModal';
import { Edit, Play } from 'lucide-react-native';
import usePlaylistStore from '@/store/usePlaylistStore';
import { Download, CloseIcon, Save, Downloaded, SinglePodcast, Delete, Remove, InfoIcon, Share2 } from '@/Icons-assets/Icon';
import useDownloadStore from '@/store/useDownloadStore';
import DownloadEngine from '@/lib/DownloadEngine';
import API from '@/services/api';
import { BlurView } from 'expo-blur';
import usePlayerStore from '@/store/usePlayerStore';

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
            backgroundColor: "rgb(28, 28, 30)",
            borderTopLeftRadius: 48,
            borderTopRightRadius: 48,
            borderRadius: 56,
            overflow: "hidden",
            paddingHorizontal: 16,
            paddingBottom: 20,
            position: "absolute",
            bottom: 6,
            right: 6,
            left: 6,
          }, bottomSheetStyle]}
        >
          <Pressable
            onPress={() => {
              handleClose();
            }}
            style={{
              position: "absolute",
              top: 20,
              right: 20,
              height: 44,
              width: 44,
              backgroundColor: "rgba(11, 11, 11, 0.6)",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 24,
              zIndex: 12,
              shadowOffset: {
                height: 4,
                width: -3
              },
              shadowColor: "rgb(0, 0, 0)",
              shadowOpacity: 0.15,
              shadowRadius: 16,

              elevation: 5,
              overflow: "hidden"
            }}
          >
            <BlurView
              intensity={22}
              tint='dark'
              style={{
                height: "100%",
                width: '100%',
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "rgba(255, 255, 255, 0.1)"
              }}
            >
              <CloseIcon size={24} strokeWidth={2} color='rgb(255, 255, 255)' />
            </BlurView>
          </Pressable>

          <View
            style={{
              height: 12,
              paddingTop: 6,
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

          {type === "playlist" ? <PlaylistModal handleClose={handleClose} /> : <EpisodeModal handleClose={handleClose} />}

        </Animated.View>
      </GestureDetector>

    </View>
  );
};

const PlaylistModal = ({ handleClose }: { handleClose: () => void }) => {
  const { tappedPlaylist } = useModalStore();
  const { fetchPlaylists } = usePlaylistStore();

  const handleDelete = async () => {
    if (tappedPlaylist) {
      await API.deletePlaylist(tappedPlaylist?.id);
    }
    fetchPlaylists();
  }

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
            paddingVertical: 12,
            paddingRight: 40,
            paddingLeft: 4
          }}
        >
          <Text
            numberOfLines={1}
            style={{
              fontFamily: "SF Pro",
              fontSize: 18,
              fontWeight: "500",
              lineHeight: 28,
              color: "rgba(255, 255, 255, 0.8)"
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
          borderRadius: 26,
        }}
      >

        <Pressable
          style={[style.optionContainer]}
        >
          {/* icon */}
          <View
            style={style.iconContainer}
          >
            <Edit size={22} strokeWidth={1.8} color={'rgb(255, 255, 255)'} />
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
          onPress={() => {
            handleClose();

            Alert.alert(
              'Delete Playlist?', 
              `Just checking to make sure you want to delete "${tappedPlaylist?.title}". You won't be able to get it back once it's gone.`,
              [
                {
                  text: 'Cancel', 
                  style: "cancel"
                },
                {
                  text: 'Delete', 
                  onPress:() => {handleDelete()},
                  style: "destructive"
                }
              ]
            )
          }}
          style={[style.optionContainer]}
        >
          {/* icon */}
          <View
            style={style.iconContainer}
          >
            <Delete size={26} fill={'rgb(255, 255, 255)'} />
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
    fetchSavedEpisodes,
    fetchEpisodes
  } = usePlaylistStore();
  const { downloadEpisodes, tasks } = useDownloadStore();
  const { setActiveEpisode } = usePlayerStore();

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
        await fetchEpisodes(selectedPlaylist.id);
        await fetchDPEpisodes();
        await fetchSavedEpisodes();
      }
      handleClose();
    };

    return (
      <View>
        {/* title */}
        <View
          style={{
            marginBottom: 8,
            paddingHorizontal: 4,
            justifyContent: "center",
          }}
        >
          <View
            style={{
              justifyContent: "center",
              borderBottomWidth: 1,
              borderBottomColor: "rgba(255, 255, 255, 0.2)",
              paddingVertical: 12,
              paddingRight: 40,
              paddingLeft: 4
            }}
          >
            <Text
              numberOfLines={1}
              style={{
                fontFamily: "SF Pro",
                fontSize: 18,
                fontWeight: "500",
                lineHeight: 28,
                color: "rgba(255, 255, 255, 0.8)"
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
                lineHeight: 24,
                color: "rgba(255, 255, 255, 0.6)"
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
            borderRadius: 26,
            marginTop: 12
          }}
        >
          <TouchableOpacity
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
              <Play size={22} strokeWidth={1.8} fill={'rgb(255, 255, 255)'} color={'rgb(255, 255, 255)'} />
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
          </TouchableOpacity>

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
                  ? <Downloaded size={24} fill='rgb(255, 255, 255)' />
                  : <Download size={22} strokeWidth={1.8} color='rgb(255, 255, 255)' />
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
                {isHistoricallyDownladed ? 'Remove From Download' : 'Download'}
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
              <Save size={22} strokeWidth={1.8} color='rgb(255, 255, 255)'
                fill={isSaved ? 'rgb(255, 255, 255)' : 'none'}
              />
            </View>

            {/* text */}
            <View
              style={style.textContainer}
            >
              <Text
                numberOfLines={1}
                style={style.text}
              >
                {isSaved ? 'Remove From Save' : 'Save'}
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
              <Share2 size={24} strokeWidth={1.8} color='rgb(255, 255, 255)' />
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
            selectedPlaylist?.type !== 'Download' && (
              <Pressable
                onPress={handleRemovalFromPlaylist}
                style={[style.optionContainer]}
              >
                {/* icon */}
                <View
                  style={style.iconContainer}
                >
                  <Remove size={26} color='rgb(255, 255, 255)' strokeWidth={1.5} />
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
          }

          <View
            style={[style.optionContainer]}
          >
            {/* icon */}
            <View
              style={style.iconContainer}
            >
              <InfoIcon size={24} strokeWidth={1.5} color='rgb(255, 255, 255)' />
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
              <SinglePodcast size={24} strokeWidth={1.8} color='rgb(255, 255, 255)' />
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