import { Stack } from "expo-router";
import SafeArea from "@/components/SafeArea";
import AudioController from "@/components/AudioController";
import FullPlayer from "@/components/FullPlayer";
import MiniPlayer from "@/components/MiniPlayer";
import useAuthStore from "@/store/useAuthStore";
import useSubscriptionStore from "@/store/useSubscriptionStore";
import { useEffect } from "react";
import SearchScreen from "@/components/SearchScreen";
import GlobalModal from "@/components/GlobalModal";
import CreatePlaylistModal from "@/components/CreatePlaylistModal";
import PlaylistSelection from "@/components/PlaylistSelectionModal";
import usePlaylistStore from "@/store/usePlaylistStore";
import { initNetworkListener, useNetworkStore } from "@/store/useNetworkStore";
import useDownloadStore from "@/store/useDownloadStore";
// import { Text, View } from "react-native";

export default function RootLayout() {
  // here we use isHydration for loading splash screen
  // if(!isHydrated) {
  //   return (
  //     <>
  //       <SafeArea>
  //         <View>
  //           <Text>
  //             This is loading screen
  //           </Text>
  //         </View>
  //       </SafeArea>
  //     </>
  //   )
  // }

  const { isAuthorized, isHydrated } = useAuthStore();
  const { setSubscriptionIds, setFollowingPodcasts, followingPodcasts, fetchFeed } = useSubscriptionStore();
  const { fetchPlaylists } = usePlaylistStore();
  const { isOnline } = useNetworkStore();
  const { hydrate } = useDownloadStore();

  useEffect(() => {
    setFollowingPodcasts();
    fetchPlaylists();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    hydrate();
    const unsubscribeNetwork = initNetworkListener();

    return () => {
      unsubscribeNetwork();
    }
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    const subsIds = followingPodcasts.map((item: any) => item.id);
    setSubscriptionIds(subsIds);
    fetchFeed(1);
    //eslint-disable-next-line
  }, [followingPodcasts]);

  return (
    <SafeArea
      backgroundColor="null"
    >
      <AudioController />

      {/* {
        !isOnline && (
          <View
            style={{
              flex: 1
            }}
          >
            <Text>
              App is offline
            </Text>
          </View>
        )
      } */}

      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Protected guard={isAuthorized}>
          <Stack.Screen name="(tabs)" />
        </Stack.Protected>

        <Stack.Protected guard={!isAuthorized}>
          <Stack.Screen name="(auth)" />
        </Stack.Protected>
      </Stack>

      <FullPlayer />
      <MiniPlayer />
      <SearchScreen/>

      <GlobalModal/>
      <CreatePlaylistModal/>
      <PlaylistSelection/>
    </SafeArea>
  );
};
