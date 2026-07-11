import { Stack } from "expo-router";

const SearchLayout = () => {
  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false
        }}
      >
        <Stack.Screen name="index" options={{animation: "none"}}/>
        <Stack.Screen name="category"/>
        <Stack.Screen name="podcast/[id]"/>
        
        <Stack.Screen name="search" options={{animation: "none"}}/>
      </Stack>
    </>
  );
};

export default SearchLayout;