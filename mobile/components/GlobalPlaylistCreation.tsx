import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { useCallback, useState } from 'react';
import API from '@/services/api';
import usePlaylistStore from '@/store/usePlaylistStore';
import Animated from 'react-native-reanimated';
import useModalStore from '@/store/useModalStore';

const GlobalPlaylistCreation = () => {

  const [title, setTitle] = useState("");
  const { fetchPlaylists } = usePlaylistStore();
  const { savingInNewPlaylist, cancelSavingToNewPlaylist, tappedEpisode, podcastId } = useModalStore();

  const handleTextChange = useCallback((text: string) => {
    setTitle(text);
  }, []);

  const handleSave = async () => {
    try {
      const body = {
        title: title
      };

      const newPlaylist = await API.createPlaylist(body);
      const savedPlaylist = newPlaylist.playlist;

      const requestBody = {
        podcastId: podcastId,
        episodeId: tappedEpisode?.id,
        playlistId: savedPlaylist._id
      };

      await API.addEpisodeToPlaylist(requestBody);
      console.log("Episode saved successfully.");

      fetchPlaylists();
      handleClose();
    } catch (error) {
      console.error("Error adding episode to new playlist:", error);
      handleClose();
    };
  };

  const handleClose = () => {
    cancelSavingToNewPlaylist();
    setTitle("");
  };

  const isInputEmpty = title.trim().length === 0;

  if (!savingInNewPlaylist) return;

  return (
    <View
      style={{
        flex: 1,
        position: "absolute",
        right: 0,
        left: 0,
        bottom: 0,
        top: 0,
        backgroundColor: "rgba(0, 0, 0, 0.4)",
        justifyContent: "center",
        zIndex: 950,
        paddingHorizontal: 36
      }}
    >

      <Animated.View
        style={{
          backgroundColor: "white",
          padding: 14,
          borderRadius: 34,
          gap: 16
        }}
      >
        <View
          style={{
            padding: 8
          }}
        >
          <Text
            style={{
              fontFamily: "SF Pro",
              fontWeight: "500",
              fontSize: 17,
              lineHeight: 22,
            }}
          >
            Please enter the title for new playlist.
          </Text>
        </View>

        <View
          style={{
            height: 48,
            backgroundColor: "rgba(0, 0, 0, 0.2)",
            borderRadius: 24,
            paddingLeft: 12,
            justifyContent: "center"
          }}
        >
          <TextInput
            placeholder='Title'
            value={title}
            onChangeText={handleTextChange}
            autoFocus={true}
            style={{
              fontFamily: "SF Pro",
              fontSize: 16,
              fontWeight: "500",
            }}
          />
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 16
          }}
        >
          <TouchableOpacity
            onPress={handleClose}
            style={{
              flex: 1,
              paddingVertical: 12,
              paddingHorizontal: 24,
              backgroundColor: "rgba(0, 0, 0, 0.2)",
              borderRadius: 24,
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Text
              style={{
                fontFamily: "SF Pro",
                fontSize: 16,
                fontWeight: "500",
                lineHeight: 24
              }}
            >
              Cancel
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              if(isInputEmpty) return;
              handleSave();
            }}
            style={{
              flex: 1,
              paddingVertical: 12,
              paddingHorizontal: 24,
              backgroundColor: isInputEmpty ? "rgba(0, 0, 0, 0.2)" : "rgb(0, 136, 255)",
              borderRadius: 24,
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Text
              style={{
                fontFamily: "SF Pro",
                fontSize: 16,
                fontWeight: "500",
                lineHeight: 24,
                color: isInputEmpty ? "rgba(0, 0, 0, 0.4)" : "white"
              }}
            >
              Save
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
}

export default GlobalPlaylistCreation;