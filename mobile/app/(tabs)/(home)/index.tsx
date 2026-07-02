import { View, Text, ScrollView, Pressable } from 'react-native';
import Section from '@/components/Section';
import { usePodcastStore } from '@/store/usePodcastStore';
import { useEffect } from 'react';
// import { useNetworkStore } from '@/store/useNetworkStore';
import NewEpisodes from '@/components/NewEpisodes';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import useAuthStore from '@/store/useAuthStore';
import { NewEpisodesSkeleton, SectionSkeleton } from '@/components/SkeletonLoader';

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
              source={{ uri: user?.profilePic }}
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
  const { fetchData, podcastsData, fetchPodcastsData, isLoading } = usePodcastStore();
  // const { isOnline } = useNetworkStore();

  const insets = useSafeAreaInsets();

  useEffect(() => {
    fetchData();
    fetchPodcastsData();
  }, [fetchData, fetchPodcastsData]);

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
        contentContainerStyle={{
          paddingBottom: 120
        }}
      >
        <Header />
        <>
          <NewEpisodes />

          {/* <NewEpisodesSkeleton /> */}

          <View
            style={{
              paddingTop: 24
            }}
          >
            {isLoading
              ? (
                <View
                  style={{
                    gap: 24
                  }}
                >
                  <SectionSkeleton />
                  <SectionSkeleton />
                </View>
              )
              : (
                <View>
                  <Section title='Popular' data={podcastsData.popular} />
                  <Section title={'History'} data={podcastsData.history} />
                  <Section title={'Comedy'} data={podcastsData.comedy} />
                  <Section title={'Education'} data={podcastsData.education} />
                  <Section title={'Technology'} data={podcastsData.technology} />
                  <Section title={'Science'} data={podcastsData.science} />
                  <Section title={'Buiness'} data={podcastsData.business} />
                  <Section title={'True Crime'} data={podcastsData.trueCrime} />
                  <Section title={'News'} data={podcastsData.news} />
                  <Section title={'Health & Fitness'} data={podcastsData.health} />
                  <Section title={'Fiction'} data={podcastsData.fiction} />
                </View>
              )
            }
          </View>

        </>
      </ScrollView>
    </View>

  )
}

export default HomeScreen;