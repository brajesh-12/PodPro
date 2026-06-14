import { View, Text, ScrollView, Pressable } from 'react-native';
import Section from '@/components/Section';
import { usePodcastStore } from '@/store/usePodcastStore';
import { useEffect } from 'react';
import { useNetworkStore } from '@/store/useNetworkStore';
import NewEpisodes from '@/components/NewEpisodes';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Header = () => {
  // const router = useRouter();

  return (
    <View
      style={{
        backgroundColor: 'none',
        marginBottom: 8
      }}
    >
      <View
        style={{
          height: 48,
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
              height: 40,
              width: 40,
              backgroundColor: "grey",
              borderRadius: 100
            }}
          ></Pressable>
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