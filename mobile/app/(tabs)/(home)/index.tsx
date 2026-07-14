import { View, Text, ScrollView, Pressable } from 'react-native';
import Section from '@/components/Section';
import { usePodcastStore } from '@/store/usePodcastStore';
import { useEffect } from 'react';
// import { useNetworkStore } from '@/store/useNetworkStore';
import NewEpisodes from '@/components/NewEpisodes';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import { Image } from 'expo-image';
import useAuthStore from '@/store/useAuthStore';
import { SectionSkeleton } from '@/components/SkeletonLoader';
import { ProfileIcon } from '@/Icons-assets/Icon';
import { useRouter } from 'expo-router';
import categories from '@/constants/categories';
import { CATEGORIES } from '@/services/podcastAPI';

const Header = () => {
  // const router = useRouter();
  // const { user } = useAuthStore();

  return (
    <View
      style={{
        backgroundColor: 'none',
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
          <Pressable>
            <ProfileIcon size={44} color="rgb(141, 11, 167)" />
          </Pressable>
          {/* <Pressable
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
          </Pressable> */}
          {/* <View
            style={{
              height: 40,
              width: 40,
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <LottieView
              ref={lottieRef}
              style={{
                height: 32,
                width: 32,
                position: "absolute",
                right: 4,
                left: 4,
                top: 4,
                bottom: 4,
                zIndex: 2
              }}
              source={require("@/assets/micro-animation/icon.json")}
              loop={true}
            />

            <Svg
              width="40" height="40" viewBox="0 0 40 40"
              style={{ transform: [{ rotate: '-90deg' }] }}
            >
              <Circle cx={'20'} cy={'20'} r={18} stroke={"#E5E5EA"} strokeWidth={"4"} fill={'none'} />
              <AnimatedCircle
                cx="20" cy="20" r={18}
                stroke="#000" strokeWidth="4" fill="none"
                strokeLinecap="round" strokeDasharray={CIRCUMFERENCE}
                animatedProps={animatedProps}
              // originX="20" originY="20" rotation="-90"
              />
            </Svg>
          </View> */}

        </View>
      </View>

    </View>
  );
};

const HomeScreen = () => {
  const router = useRouter();
  const { podcastsData, fetchPodcastsData, isLoading, setCategoryTitle } = usePodcastStore();
  // const { isOnline } = useNetworkStore();

  const insets = useSafeAreaInsets();

  useEffect(() => {
    fetchPodcastsData();
  }, [fetchPodcastsData]);

  const onPress = (title: string, code: string)=> {
    setCategoryTitle(title);
    router.navigate({
      pathname: "/(tabs)/(home)/category/[code]",
      params: {code: code}
    })
  }

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

          <View
            style={{
              paddingTop: 12
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
                  <Section title='Popular' data={podcastsData.popular} tab='home' 
                    onPress={() => {onPress('Popular', CATEGORIES.ALL)}}
                  />
                  <Section title={'History'} data={podcastsData.history} tab='home' 
                    onPress={() => {onPress('History', CATEGORIES.HISTORY)}}
                  />
                  <Section title={'Comedy'} data={podcastsData.comedy} tab='home' 
                    onPress={() => {onPress('Comedy', CATEGORIES.COMEDY)}}
                  />
                  <Section title={'Education'} data={podcastsData.education} tab='home' 
                    onPress={() => {onPress('Education', CATEGORIES.EDUCATION)}}
                  />
                  <Section title={'Technology'} data={podcastsData.technology} tab='home' 
                    onPress={() => {onPress('Technology', CATEGORIES.TECHNOLOGY)}}
                  />
                  <Section title={'Science'} data={podcastsData.science} tab='home' 
                    onPress={() => {onPress('Science', CATEGORIES.SCIENCE)}}
                  />
                  <Section title={'Business'} data={podcastsData.business} tab='home' 
                    onPress={() => {onPress('Business', CATEGORIES.BUSINESS)}}
                  />
                  <Section title={'True Crime'} data={podcastsData.trueCrime} tab='home' 
                    onPress={() => {onPress('True Crime', CATEGORIES.TRUE_CRIME)}}
                  />
                  <Section title={'News'} data={podcastsData.news} tab='home' 
                    onPress={() => {onPress('News', CATEGORIES.NEWS)}}
                  />
                  <Section title={'Health & Fitness'} data={podcastsData.health} tab='home' 
                    onPress={() => {onPress('Health & Fitness', CATEGORIES.HEALTH)}}
                  />
                  <Section title={'Fiction'} data={podcastsData.fiction} tab='home' 
                    onPress={() => {onPress('Fiction', CATEGORIES.FICTION)}}
                  />
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