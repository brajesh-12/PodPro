import { Stack } from "expo-router";
import AudioController from "@/components/AudioController";
import useAuthStore from "@/store/useAuthStore";
import { useEffect } from "react";
import CreatePlaylistModal from "@/components/CreatePlaylistModal";
// import PlaylistSelection from "@/components/PlaylistSelectionModal";
import { initNetworkListener } from "@/store/useNetworkStore";
import useDownloadStore from "@/store/useDownloadStore";
import CustomModal from "@/components/CustomModal";
// import { StatusBar } from "react-native";
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import PlaylistSelection from "@/components/PlaylistSelection";
import PlaylistBottomSheet from "@/components/PlaylistBottomSheet";
import GlobalPlaylistCreation from "@/components/GlobalPlaylistCreation";
import ProfileScreenModal from "@/components/ProfileScreenModal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DarkTheme, ThemeProvider } from "@react-navigation/native";

const MyCustomTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: 'rgb(11, 11, 11)',
    background: "rgb(11, 11, 11)",
    card: '#1A1A1A', // Background color for headers/tab bars
    text: 'rgb(255, 255, 255)', 
    border: '#272729',
    notification: '#FF4500',
  },
};

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
  const { isAuthorized, isHydrated, clearLocalStore } = useAuthStore();

  useEffect(() => {
    const checkFreshInstall = async () => {
      try {
        const hasLaunched = await AsyncStorage.getItem('has_launched_before');

        if (hasLaunched === null) {
          clearLocalStore();

          await AsyncStorage.setItem('has_launched_before', 'true');
        }
      } catch (error) {
        console.error("Error checking fresh install:", error);
      }
    };

    checkFreshInstall();
    // eslint-disable-next-line
  }, []);

  // const { isOnline } = useNetworkStore();
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
    <ThemeProvider
      value={MyCustomTheme}
    >
      <GestureHandlerRootView>
        <StatusBar
          translucent={true}
          backgroundColor={"transparent"}
          style="light"
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

        <CustomModal />
        <CreatePlaylistModal />
        <PlaylistSelection />
        <PlaylistBottomSheet />
        <GlobalPlaylistCreation />
        <ProfileScreenModal />
      </GestureHandlerRootView>
    </ThemeProvider>
  );
};
