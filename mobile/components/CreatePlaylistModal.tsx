import { View, Text, Modal, TouchableOpacity, TextInput } from 'react-native'
import { useState } from 'react';
import API from '@/services/api';
import usePlaylistStore from '@/store/usePlaylistStore';

const CreatePlaylistModal = () => {
  const [ title, setTitle ] = useState("");
  const [ description, setDescription ] = useState("");

  const { isCreating, setIsCreating, fetchPlaylists } = usePlaylistStore();

  return (
    <Modal
      transparent={true}
      visible={isCreating}
      animationType="fade"
      onRequestClose={() => setIsCreating(false)}
    >
      {/* screen */}
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        {/* <View/> this is background */}
        {/* main modal */}
        <View
          style={{
            width: 300,
            height: 200,
            backgroundColor: "white",
            paddingHorizontal: 12,
            paddingVertical: 8,
            borderRadius: 12
          }}
        >

          <Text
            style={{
              fontFamily: "SF Pro",
              fontWeight: "600",
              fontSize: 16
            }}
          >
            New Playlist
          </Text>

          {/* Input fields */}
          <View
            style={{
              marginBottom: 12,
              marginTop: 12,
              gap: 8
            }}
          >
            {/* title */}
            <View
              style={{
                marginBottom: 8,
                gap: 8
              }}
            >
              <Text>
                Title
              </Text>
              <TextInput
                value={title}
                onChangeText={setTitle}
                style={{
                  borderBottomWidth: 1
                }}
              />
            </View>

            {/* description */}
            <View
              style={{
                gap: 8
              }}
            >
              <Text>
                Description
              </Text>
              <TextInput
                value={description}
                onChangeText={setDescription}
                style={{
                  borderBottomWidth: 1
                }}
              />
            </View>
          </View>

          {/* Buttons */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between"
            }}
          >
            <TouchableOpacity
              onPress={() => setIsCreating(false)}
              style={{
                height: 40,
                paddingHorizontal: 16,
                paddingVertical: 8,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "black",
                borderRadius: 6
              }}
            >
              <Text
                style={{
                  color: "white"
                }}
              >
                Cancel
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={async () => {
                const inputData = {
                  title,
                  description
                };

                const response = await API.createPlaylist(inputData);
                console.log("New Playlist:", response);

                fetchPlaylists();
                setTitle("");
                setDescription("");
                setIsCreating(false);
              }}
              style={{
                height: 40,
                paddingHorizontal: 16,
                paddingVertical: 8,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "black",
                borderRadius: 6
              }}
            >
              <Text
                style={{
                  color: "white"
                }}
              >
                Save
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}

export default CreatePlaylistModal;