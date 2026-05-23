import { Stack } from "expo-router";
import SafeArea from "@/components/SafeArea";
import AudioController from "@/components/AudioController";
import FullPlayer from "@/components/FullPlayer";
import MiniPlayer from "@/components/MiniPlayer";
import useAuthStore from "@/store/useAuthStore";
import { useEffect } from "react";
import SearchScreen from "@/components/SearchScreen";
import GlobalModal from "@/components/GlobalModal";
import CreatePlaylistModal from "@/components/CreatePlaylistModal";
import PlaylistSelection from "@/components/PlaylistSelectionModal";
import { initNetworkListener, useNetworkStore } from "@/store/useNetworkStore";
import useDownloadStore from "@/store/useDownloadStore";
import CustomModal from "@/components/CustomModal";
// import { StatusBar } from "react-native";
import { StatusBar } from 'expo-status-bar';
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
  const { isOnline } = useNetworkStore();
  const { hydrate } = useDownloadStore();

  useEffect(() => {
    hydrate();
    const unsubscribeNetwork = initNetworkListener();

    return () => {
      unsubscribeNetwork();
    }
    // eslint-disable-next-line
  }, []);

  return (
    <SafeArea
      backgroundColor="null"
    >
      <StatusBar
        translucent={true}
        backgroundColor={"transparent"}
        style="auto"
      />

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

      <FullPlayer/>
      <MiniPlayer/>
      <SearchScreen/>
      <CustomModal/>

      <GlobalModal/>
      <CreatePlaylistModal/>
      <PlaylistSelection/>
    </SafeArea>
  );
};
