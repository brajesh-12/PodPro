import { Stack } from 'expo-router';

const PodLayout = () => {
  return (
    <Stack screenOptions={{headerShown: false}}>
      <Stack.Screen name='index'/>
    </Stack>
  );
};

export default PodLayout;