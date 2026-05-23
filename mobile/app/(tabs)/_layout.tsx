import { Home, Podcasts, Library } from '@/Icons-assets/Icon';
import { Tabs } from 'expo-router';
import { useEffect } from 'react';
import usePlaylistStore from '@/store/usePlaylistStore';
import useSubscriptionStore from '@/store/useSubscriptionStore';
import { Dimensions, View, Text, Pressable } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Search } from 'lucide-react-native';
// import SearchScreen from '@/components/SearchScreen';
// import HomeScreen from './(home)';
// import PodcastsScreen from './(podcast)';
// import LibraryScreen from './(library)';
// import ProfileScreen from './profile';

const width = Dimensions.get("screen").width;

// const Tab = createBottomTabNavigator();

const CustomTab = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  return (
    <View
      style={{
        flexDirection: "row",
        width: width - 32,
        position: "absolute",
        bottom: 32,
        right: 16,
        left: 16,
        backgroundColor: "white",
        height: 64,
        borderRadius: 32
      }}
    >
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;

        const { options } = descriptors[route.key];

        const icon = options.tabBarIcon ? options.tabBarIcon({ focused: isFocused, color: 'yellow', size: 22 }) : null;

        if(!icon) return null;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name)
          }
        }

        return (
          <Pressable
            key={route.key}
            onPress={onPress}
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              gap: 2
            }}
          >
            {icon}

            <Text
              style={{
                fontFamily: "SF Pro",
                fontSize: 10,
                fontWeight: `${isFocused ? "700" : "600"}`,
                lineHeight: 12
              }}
            >
              {options.title}
            </Text>
          </Pressable>
        )
      })}

    </View>
  )
}

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

        <Tabs.Screen name='(podcast)' options={{ title: "Podcast", tabBarIcon: ({focused}) => <Podcasts size={22} 
          color={focused ? 'blue' : 'black'}
        /> }} />

        <Tabs.Screen name='(search)' options={{ title: "Search", tabBarIcon: ({focused}) => <Search size={22} 
          color={focused ? 'blue' : 'black'}
        />}}/>

        <Tabs.Screen name='(library)' options={{ title: "Library", tabBarIcon: () => <Library size={22} /> }} />
        
        <Tabs.Screen name='profile' options={{
          title: "Profile",
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                height: 22,
                width: 22,
                borderRadius: 11,
                backgroundColor: `${focused ? "black" : "grey"}`
              }}
            >
            </View>
          )
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