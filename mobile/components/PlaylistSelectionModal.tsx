import useModalStore from '@/store/useModalStore';
import usePlaylistStore from '@/store/usePlaylistStore';
import { View, Text, Modal, Pressable, FlatList } from 'react-native';
import { X } from 'lucide-react-native';
import { usePodcastStore } from '@/store/usePodcastStore';

const PlaylistSelection = () => {
  const { isAddTo, setIsAddTo, tappedEpisode, podcastId } = useModalStore();
  const { addToPlaylists, setIsCreating, addingEpisode } = usePlaylistStore();
  const { podcast } = usePodcastStore();

  return (
    <Modal
      visible={isAddTo}
      transparent={true}
      onRequestClose={() => setIsAddTo(false)}
      animationType="slide"
    >
      <View
        style={{
          flex: 1,
          position: "relative",
        }}
      >
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
                  fontWeight: "600",
                  fontSize: 18,
                  lineHeight: 28
                }}
              >Save 1 episode to playlist</Text>
            </View>

            <Pressable
              onPress={() => setIsAddTo(false)}
            >
              <X size={24} />
            </Pressable>
          </View>

          {/* options */}
          <FlatList
            data={addToPlaylists}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{
              flex: 1
            }}
            renderItem={({item}) => (
              <Pressable
                onPress={() => {
                  const body = {
                    podcastId: podcast?.id || podcastId,
                    episodeId: tappedEpisode?.id,
                    playlistId: item.id
                  }
                  addingEpisode(body);
                  
                  setIsAddTo(false);
                }}
                style={{
                  height: 40,
                  justifyContent: "center"
                }}
              >
                <Text
                  style={{
                    fontFamily: "SF Pro",
                    fontSize: 14,
                    fontWeight: "500",
                    lineHeight: 20
                  }}
                >
                  {item.title}
                </Text>
              </Pressable>
            )}
          />

          <Pressable
            onPress={() => {
              setIsAddTo(false);
              setIsCreating(true);
            }}
          >
            <Text>
              New Playlist
            </Text>
          </Pressable>

        </View>

      </View>
    </Modal>
  )
}

export default PlaylistSelection;