import { Home, Podcasts, Library, ProfileIcon } from '@/Icons-assets/Icon';
import { Tabs } from 'expo-router';
import { useEffect } from 'react';
import usePlaylistStore from '@/store/usePlaylistStore';
import useSubscriptionStore from '@/store/useSubscriptionStore';
import { Search } from 'lucide-react-native';
import CustomTab from '@/components/CustomNavigationTab';

// const Tab = createBottomTabNavigator();


const TabsLayout = () => {
  const { setSubscriptionIds, setFollowingPodcasts, followingPodcasts, fetchFeed } = useSubscriptionStore();
  const { fetchPlaylists } = usePlaylistStore();

  useEffect(() => {
    setFollowingPodcasts();
    fetchPlaylists();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const subsIds = followingPodcasts.map((item: any) => item.id);
    setSubscriptionIds(subsIds);
    fetchFeed(1);
    //eslint-disable-next-line
  }, [followingPodcasts]);

  return (
    <>
      <Tabs
        tabBar={(props) => <CustomTab {...props} />}
        screenOptions={{ headerShown: false }}
      >
        <Tabs.Screen name='(home)' options={{ title: "Home", tabBarIcon: ({ focused, color }) => <Home size={22} fill={focused ? 'blue' : "none"} color={focused ? 'blue' : "black"} />, }} />

        <Tabs.Screen name='(podcast)' options={{
          title: "Podcasts", tabBarIcon: ({ focused }) => <Podcasts size={22}
            color={focused ? 'blue' : 'black'}
          />
        }} />

        <Tabs.Screen name='(search)' options={{
          title: "Search", tabBarIcon: ({ focused }) => <Search size={22}
            color={focused ? 'blue' : 'black'}
          />
        }} />

        <Tabs.Screen name='(library)' options={{ title: "Library", tabBarIcon: () => <Library size={22} /> }} />

        <Tabs.Screen name='profile' options={{
          title: "Profile",
          tabBarIcon: ({ focused }) => <ProfileIcon size={22} color={focused ? "rgb(141, 11, 167)" : "black"} />
        }}
        />
      </Tabs>

      {/* <Tab.Navigator
        tabBar={(props) => <CustomTab {...props}/>}
        screenOptions={{headerShown: false}}
      >
        <Tab.Screen name='Home' component={HomeScreen}
          options={{
            tabBarIcon: ({focused, color}) => <Home size={22}
            fill={focused ? "black" : "none"} color={focused ? 'black' : "black"}
          />,
        }}
        />
        <Tab.Screen name='Podcasts' component={PodcastsScreen}
          options={{tabBarIcon: ({focused}) => <Podcasts size={22}/>}}
        />
        <Tab.Screen name='Library' component={LibraryScreen}
          options={{tabBarIcon: ({focused}) => <Library size={22}/>}}
        />
        <Tab.Screen name='Profile' component={ProfileScreen}
          options={{tabBarIcon: ({focused}) => (
            <View
              style={{
                height: 22,
                width: 22,
                borderRadius: 11,
                backgroundColor: `${focused ? "black" : "grey"}`
              }}
            >

            </View>
          )}}
        />
      </Tab.Navigator> */}

    </>
  );
};

export default TabsLayout;