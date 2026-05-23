import { Stack } from 'expo-router';

const PodLayout = () => {
  return (
    <Stack screenOptions={{headerShown: false}}>
      <Stack.Screen name='index'/>
      <Stack.Screen name='search'
        options={{
          presentation: "containedModal"
        }}
      />
    </Stack>
  );
};

export default PodLayout;