import { View, Text, ScrollView, Pressable, StatusBar } from 'react-native';
import Section from '@/components/Section';
import { usePodcastStore } from '@/store/usePodcastStore';
import { useEffect } from 'react';
// import { useNetworkStore } from '@/store/useNetworkStore';
import NewEpisodes from '@/components/NewEpisodes';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import useAuthStore from '@/store/useAuthStore';

const Header = () => {
  // const router = useRouter();
  const { user } = useAuthStore();

  return (
    <View
      style={{
        backgroundColor: 'none',
        marginBottom: 8
      }}
    >
      <StatusBar barStyle={"default"}/>
      <View
        style={{
          height: 56,
          flexDirection: 'row',
          paddingLeft: 20,
          paddingRight: 12,
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 0,
          width: "100%"
        }}
      >
        {/* left container */}
        <View>
          <Text
            style={{
              fontFamily: "SF Pro",
              fontSize: 24,
              fontWeight: "800",
            }}
          >
            PodPro
          </Text>
        </View>

        {/* right container */}
        <View
          style={{
            flexDirection: 'row',
            gap: 2
          }}
        >
          <Pressable
            style={{
              height: 44,
              width: 44,
              backgroundColor: "grey",
              borderRadius: 100,
              overflow: "visible",
            }}
          >
            <Image
              source={{uri: user?.profilePic}}
              style={{
                height: "100%",
                width: "100%",
                borderRadius: 100
              }}
              contentFit="cover"
            />
          </Pressable>
        </View>
      </View>

    </View>
  );
};

const HomeScreen = () => {
  const { history, trending, fetchData, science, comedy, education } = usePodcastStore();
  // const { isOnline } = useNetworkStore();

  const historyPods = history.slice(0, 10);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // if (!isOnline) {
  //   return (
  //     <View
  //       style={{
  //         flex: 1,
  //         justifyContent: "center",
  //         alignItems: "center"
  //       }}
  //     >
  //       <Text>
  //         No Internet, Check downloads.
  //       </Text>
  //     </View>
  //   )
  // };

  return (
    <View
      style={{
        paddingTop: insets.top
      }}
    >
      <ScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
        style={{
          paddingBottom: 180
        }}
      >
        {/* <Header screen='home' /> */}
        <Header />
        <>
          <NewEpisodes />

          {/* <Trending data={trending} /> */}
          <Section title='Popular' data={trending} />
          <Section title={'History'} data={historyPods} />
          <Section title={'Comedy'} data={comedy} />
          <Section title={'Education'} data={education} />
          <Section title={'Science'} data={science} />

          {/* bottom space */}
          <View
            style={{
              height: 180,
              backgroundColor: "tranparent"
            }}
          >
          </View>
        </>
      </ScrollView>
    </View>

  )
}

export default HomeScreen;