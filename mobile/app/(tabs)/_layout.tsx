import { Home, Podcasts, Library } from '@/Icons-assets/Icon';
import { Tabs } from 'expo-router';

const TabsLayout = () => {
  return (
    <Tabs screenOptions={{headerShown: false}}>
      <Tabs.Screen name='(home)' options={{title: "Home", tabBarIcon: () => <Home size={22} />}}/>
      <Tabs.Screen name='(podcast)' options={{title: "Podcast", tabBarIcon: () => <Podcasts size={22}/>}}/>
      <Tabs.Screen name='(library)' options={{title: "Library", tabBarIcon: () => <Library size={22}/>}}/>
      <Tabs.Screen name='profile' options={{title: "Profile"}}/>
    </Tabs>
  );
};

export default TabsLayout;