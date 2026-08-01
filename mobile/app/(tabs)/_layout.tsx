import { Home, Podcasts, Library, ProfileIcon } from '@/Icons-assets/Icon';
import { Tabs } from 'expo-router';
import { useEffect } from 'react';
import usePlaylistStore from '@/store/usePlaylistStore';
import useSubscriptionStore from '@/store/useSubscriptionStore';
import { Search } from 'lucide-react-native';
import CustomTab from '@/components/CustomNavigationTab';
import DownloadEngine from '@/lib/DownloadEngine';
import useDownloadStore from '@/store/useDownloadStore';

const TabsLayout = () => {
  const { setSubscriptionIds, setFollowingPodcasts, followingPodcasts, fetchFeed } = useSubscriptionStore();
  const { fetchPlaylists, fetchDPEpisodes } = usePlaylistStore();
  const { hydrate } = useDownloadStore();
  // const { syncOfflineDelete } = useSyncDownload();

  const syncWithDatabase = async () => {
    await fetchPlaylists();
    await fetchDPEpisodes();
    await hydrate();
    DownloadEngine.syncDownloadWithDatabase();
  }

  useEffect(() => {
    setFollowingPodcasts();
    syncWithDatabase();
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
        <Tabs.Screen name='(home)' options={{ title: "Home", tabBarIcon: ({ focused, color }) => <Home size={22} fill={focused ? 'rgb(255, 255, 255)' : "rgba(255, 255, 255, 0.6)"} color={focused ? 'rgb(255, 255, 255)' : "rgba(255, 255, 255, 0.5)"} />}} />

        <Tabs.Screen name='(podcast)' options={{
          title: "Podcasts", tabBarIcon: ({ focused }) => <Podcasts size={22}
            color={focused ? 'rgb(255, 255, 255)' : "rgba(255, 255, 255, 0.6)"}
          />
        }} />

        <Tabs.Screen name='(search)' options={{
          title: "Search", tabBarIcon: ({ focused }) => <Search size={22}
            color={focused ? 'rgb(255, 255, 255)' : "rgba(255, 255, 255, 0.6)"}
          />
        }} />

        <Tabs.Screen name='(library)' options={{ title: "Library", tabBarIcon: ({focused}) => 
          <Library size={22} 
            color={focused ? 'rgb(255, 255, 255)' : "rgba(255, 255, 255, 0.6)"}
          /> 
          }} />

        <Tabs.Screen name='profile' options={{
          title: "Profile",
          tabBarIcon: ({ focused }) => <ProfileIcon size={22} color={focused ? 'rgb(255, 255, 255)' : "rgba(255, 255, 255, 0.6)"} />
        }}
        />
      </Tabs>

    </>
  );
};

export default TabsLayout;