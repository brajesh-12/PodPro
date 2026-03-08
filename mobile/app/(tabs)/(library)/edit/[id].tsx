import { View, Text, Pressable, TouchableOpacity, ScrollView, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { ArrowLeft, Edit2, Plus } from 'lucide-react-native';
import usePlaylistStore from '@/store/usePlaylistStore';
import { Image } from 'expo-image';
import { formatProgress } from '@/lib/utils';
import API from '@/services/api';

const EditPlaylist = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const { selectedPlaylist, singlePlaylist, playlistEpisodes, fetchEpisodes, fetchPlaylists } = usePlaylistStore();

  const handleUpdate = async () => {
    const body = {
      title: title,
      description: description
    }

    await API.updatePlaylist(selectedPlaylist?.id, body);
    fetchPlaylists();
  }

  useEffect(() => {
    singlePlaylist(id);
    fetchEpisodes(id);
    // eslint-disable-next-line
  }, []);

  return (
    <ScrollView>

      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          height: 48,
          paddingHorizontal: 16
        }}
      >
        <Pressable
          onPress={() => {
            router.navigate({
              pathname: "/(tabs)/(library)/playlist/[id]",
              params: { id: `${selectedPlaylist?.id}` }
            })
          }}
        >
          <ArrowLeft size={24} />
        </Pressable>

        <Pressable
          onPress={() => {
            handleUpdate();
            setTitle("");
            setDescription("");
            router.back();
          }}
        >
          <Text>
            Done
          </Text>
        </Pressable>
      </View>

      {/* Image edit */}
      <View
        style={{
          paddingVertical: 12,
          alignItems: "center"
        }}
      >

        <View
          style={{
            height: 150,
            width: 150,
            borderRadius: 4,
            position: "relative",
            backgroundColor: "grey"
          }}
        >
          <Image
            source={{ uri: selectedPlaylist?.image }}
            style={{
              width: "100%",
              height: "100%",
              borderRadius: 4
            }}
          />

          <TouchableOpacity
            style={{
              height: 40,
              width: 40,
              borderRadius: 80,
              backgroundColor: "black",
              position: "absolute",
              bottom: -6,
              right: -6,
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <Edit2 size={20} color={"white"} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Title and description */}
      <View
        style={{
          gap: 32,
          paddingHorizontal: 16
        }}
      >
        <View
          style={{
            gap: 4
          }}
        >
          <Text>
            Title
          </Text>

          <TextInput
            value={title}
            onChangeText={setTitle}
            style={{
              borderBottomWidth: 0.5
            }}
          />
        </View>

        <View
          style={{
            gap: 4
          }}
        >
          <Text>
            Description
          </Text>

          <TextInput
            value={description}
            onChangeText={setDescription}
            style={{
              borderBottomWidth: 0.5
            }}
          />
        </View>
      </View>

      <View
        style={{
          paddingVertical: 24,
          paddingHorizontal: 16
        }}
      >
        <View
          style={{
            height: 32
          }}
        >
          <Text>
            {playlistEpisodes.length > 1 ? `${playlistEpisodes.length} Episodes` : `${playlistEpisodes.length} Episode`}
          </Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 12
          }}
        >
          <View
            style={{
              height: 54,
              width: 54,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "grey",
              borderRadius: 4
            }}
          >
            <Plus size={24} color={"white"}/>

          </View>

          <Text>
            Add Episode
          </Text>
        </View>

        {playlistEpisodes.map((item) => (
          <View
            key={item.id}
            style={{
              paddingVertical: 12
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 8
              }}
            >
              {/* Image */}
              <View
                style={{
                  height: 54,
                  width: 54,
                }}
              >
                <Image
                  source={{ uri: item.image }}
                  style={{
                    height: "100%",
                    width: "100%",
                    borderRadius: 2
                  }}
                />
              </View>

              <View>
                <Text>
                  {item.title}
                </Text>

                <Text>
                  {item.podcastTitle} . {formatProgress(item.duration)}
                </Text>
              </View>

            </View>

          </View>
        ))}
      </View>
    </ScrollView>
  )
}

export default EditPlaylist;