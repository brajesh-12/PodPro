import Header from '@/components/Header';
import { ChevronDown, LayoutGrid, List } from 'lucide-react-native';
import { View, Text, FlatList, TouchableOpacity, Modal, TextInput, Pressable } from 'react-native';
import { useEffect, useState } from 'react';
import { BoardLayout, ListLayout } from '@/components/Playlist';
import API from '@/services/api';
import usePlaylistStore from '@/store/usePlaylistStore';
import { useNetworkStore } from '@/store/useNetworkStore';
import useDownloadStore from '@/store/useDownloadStore';
import { formatDuration } from '@/lib/utils';
import { Image } from 'expo-image';
import usePlayerStore from '@/store/usePlayerStore';

const LibraryScreen = () => {
  const [layout, setLayout] = useState(true);
  // const [playlists, setPlaylists] = useState<Playlist[]>([]);

  const { allPlaylists, fetchPlaylists } = usePlaylistStore();
  const { isOnline } = useNetworkStore();
  const { downloadEpisodes } = useDownloadStore();
  const downloadEpisodesArr = Object.values(downloadEpisodes);
  const { setActiveEpisode } = usePlayerStore();

  const [modalVisibile, setModalVisible] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleLayout = () => {
    setLayout(!layout);
  }

  // const fetchPlaylists = async () => {
  //   try {
  //     const playlists = await API.getPlaylists();
  //     setPlaylists(playlists);
  //   } catch (error: any) {
  //     console.log(error.response.data?.message);
  //     Alert.alert("Server Error", "Could not fetch playlists.");
  //   }
  // }

  useEffect(() => {
    fetchPlaylists();
    // eslint-disable-next-line
  }, []);

  const AddButton = () => {
    return (
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={{
          paddingVertical: 12,
          paddingHorizontal: 24,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "black",
          position: "absolute",
          right: 20,
          bottom: 190,
          borderRadius: 32,
          height: 48
        }}
      >
        <Text
          style={{
            color: "white"
          }}
        >
          New Playlist
        </Text>
      </TouchableOpacity>
    )
  };

  const LibraryHeader = () => {
    return (
      <View>
        <Header screen='library' />

        {/* filter section */}
        <View
          style={{
            flexDirection: 'row',
            paddingHorizontal: 20,
            alignItems: 'center',
            justifyContent: 'space-between',
            height: 40,
            marginBottom: 8
          }}
        >

          {/* Left container */}
          <View
            style={{
              flexDirection: "row",
              gap: 8,
              alignItems: 'center'
            }}
          >
            <Text
              style={{
                fontFamily: "SF Pro",
                fontWeight: "500",
                fontSize: 14,
                lineHeight: 16
              }}
            >
              Recent
            </Text>

            <ChevronDown size={16} strokeWidth={2} />
          </View>

          {/* Right container */}
          <TouchableOpacity
            style={{
              height: 32,
              width: 32,
              borderRadius: 64,
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onPress={handleLayout}
          >
            {
              layout ? <LayoutGrid size={20} strokeWidth={2} /> : <List size={20} strokeWidth={2} />
            }
          </TouchableOpacity>

        </View>
      </View>
    )
  };

  const offlineHeader = () => {
    return (
      <View
        style={{
          height: 48,
          width: "auto",
          alignItems: "flex-start",
          paddingHorizontal: 16,
          justifyContent: "center"
        }}
      >
        <Text
          style={{
            fontFamily: "SF Pro",
            fontSize: 18,
            fontWeight: "600",
            lineHeight: 28
          }}
        >
          Downloads
        </Text>
      </View>
    )
  }

  if (!isOnline) {
    return (
      <View
        style={{
          flex: 1
        }}
      >
        <FlatList
          data={downloadEpisodesArr}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={offlineHeader}
          renderItem={({ item }) => {
            return (
              <Pressable
                onPress={() => setActiveEpisode(item)}
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
              </Pressable>
            )
          }}
        />
      </View>
    )
  }

  return (
    <View
      style={{
        position: "relative",
        flex: 1
      }}
    >

      {/* Playlists Layout */}
      <FlatList
        key={layout ? 'list' : 'grid'}
        scrollEnabled={true}
        showsVerticalScrollIndicator={false}
        data={allPlaylists}
        keyExtractor={(item) => item.id}
        numColumns={layout ? 1 : 2}
        ListHeaderComponent={LibraryHeader}
        columnWrapperStyle={!layout && {
          gap: 16,
          paddingHorizontal: 20
        }}
        renderItem={({ item }) => layout ? <ListLayout playlist={item} /> : <BoardLayout playlist={item} />}

      />

      <AddButton />

      {/* Modal for creating playlist */}
      <Modal
        transparent={true}
        visible={modalVisibile}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
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
                onPress={() => setModalVisible(false)}
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
                  setModalVisible(false);
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
    </View>
  );
}

export default LibraryScreen;