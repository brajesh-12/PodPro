import { Tabs } from "expo-router";
import SafeArea from "@/components/SafeArea";
import AudioController from "@/components/AudioController";
import FullPlayer from "@/components/FullPlayer";
import MiniPlayer from "@/components/MiniPlayer";

export default function RootLayout() {
  return (
    <SafeArea>
      <AudioController />

      <Tabs
        screenOptions={{
          headerShown: false
        }}
      >
        <Tabs.Screen
          name="(home)"
          options={{
            headerShown: false,
            title: "Home",
          }}
        />

        <Tabs.Screen
          name="podcast"
          options={{
            title: "Podcasts"
          }}
        />

        <Tabs.Screen
          name="library"
          options={{
            title: "Library"
          }}
        />
      </Tabs>

      <FullPlayer />
      <MiniPlayer />
    </SafeArea>
  );
};
