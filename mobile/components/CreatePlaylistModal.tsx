import { View, Text, TouchableOpacity, TextInput, Pressable } from 'react-native';
import { useCallback, useState } from 'react';
import API from '@/services/api';
import usePlaylistStore from '@/store/usePlaylistStore';
import Animated from 'react-native-reanimated';
import useModalStore from '@/store/useModalStore';
import { useRouter } from 'expo-router';

const CreatePlaylistModal = () => {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const { fetchPlaylists } = usePlaylistStore();
  const { isCreating, cancelCreate } = useModalStore();

  const handleTextChange = useCallback((text: string) => {
    setTitle(text);
  }, []);

  const handleSave = async () => {
    try {
      const body = {
        title: title
      };
      const newPlaylist = await API.createPlaylist(body);

      router.navigate({
        pathname: "/(tabs)/(library)/playlist/[id]",
        params: {id: `${newPlaylist.playlist._id}`}
      });
      fetchPlaylists();
      handleClose();
    } catch (error) {
      console.error("Error adding episode to new playlist:", error);
      handleClose();
    };
  };

  const handleClose = () => {
    cancelCreate();
    setTitle("");
  };

  const isInputEmpty = title.trim().length === 0;

  if (!isCreating) return;

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
          backgroundColor: "rgb(28, 28, 30)",
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
              color: "rgb(255, 255, 255)"
            }}
          >
            Please enter the title for new playlist.
          </Text>
        </View>

        <View
          style={{
            height: 48,
            backgroundColor: "rgba(255, 255, 255, 0.04)",
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
              color: 'rgb(255, 255, 255)'
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
          <Pressable
            onPress={handleClose}
            style={{
              flex: 1,
              paddingVertical: 12,
              paddingHorizontal: 24,
              backgroundColor: "rgba(255, 255, 255, 0.04)",
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
                color: 'rgb(255, 255, 255)'
              }}
            >
              Cancel
            </Text>
          </Pressable>

          <TouchableOpacity
            onPress={() => {
              if(isInputEmpty) return;
              handleSave();
            }}
            style={{
              flex: 1,
              paddingVertical: 12,
              paddingHorizontal: 24,
              backgroundColor: isInputEmpty ? "rgba(255, 255, 255, 0.04)" : "rgb(255, 255, 255)",
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
                color: isInputEmpty ? "rgba(255, 255, 255, 0.5)" : "rgb(0, 0, 0)"
              }}
            >
              Save
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
};

export default CreatePlaylistModal;