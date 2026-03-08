import { Tabs } from 'expo-router';

const TabsLayout = () => {
  return (
    <Tabs screenOptions={{headerShown: false}}>
      <Tabs.Screen name='(home)' options={{title: "Home"}}/>
      <Tabs.Screen name='(podcast)' options={{title: "Podcast"}}/>
      <Tabs.Screen name='(library)' options={{title: "Library"}}/>
      <Tabs.Screen name='profile' options={{title: "Profile"}}/>
    </Tabs>
  )
}

export default TabsLayout;