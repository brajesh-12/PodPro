import { Stack } from "expo-router";
import SafeArea from "@/components/SafeArea";

export default function RootLayout() {
  return (
    <SafeArea>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </SafeArea>
  );
};
