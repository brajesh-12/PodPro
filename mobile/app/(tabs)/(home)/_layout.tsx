import { Stack } from 'expo-router';

const HomeStackLayout = () => {

  return (
    <Stack
      screenOptions={{
        headerShown: false
      }}
    >
      <Stack.Screen name='index'/>
      <Stack.Screen
        name='search'
        options={{
          presentation: "containedModal",
        }}
      />
    </Stack>
  );
};

export default HomeStackLayout;