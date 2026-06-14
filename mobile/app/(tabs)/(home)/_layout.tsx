import { Stack } from 'expo-router';

const HomeStackLayout = () => {

  return (
    <Stack
      screenOptions={{
        headerShown: false
      }}
    >
      <Stack.Screen name='index'/>
    </Stack>
  );
};

export default HomeStackLayout;