import { View, Text, Pressable, StyleSheet } from 'react-native';
import Section from '@/components/Section';
import { usePodcastStore } from '@/store/usePodcastStore';
import { useEffect } from 'react';
// import { useNetworkStore } from '@/store/useNetworkStore';
import NewEpisodes from '@/components/NewEpisodes';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import { Image } from 'expo-image';
// import useAuthStore from '@/store/useAuthStore';
import { SectionSkeleton } from '@/components/SkeletonLoader';
import { ProfileIcon } from '@/Icons-assets/Icon';
import { useRouter } from 'expo-router';
import { CATEGORIES } from '@/services/podcastAPI';
import MaskedView from '@react-native-masked-view/masked-view';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { createAnimatedComponent, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';

const AnimatedMaskedView = createAnimatedComponent(MaskedView);

const Header = () => {
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
              color: 'white'
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
            <ProfileIcon size={44} color="rgb(199, 199, 199)" />
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
  const scrollY = useSharedValue(0);
  // const { isOnline } = useNetworkStore();

  const insets = useSafeAreaInsets();

  useEffect(() => {
    fetchPodcastsData();
  }, [fetchPodcastsData]);

  const onPress = (title: string, code: string) => {
    setCategoryTitle(title);
    router.navigate({
      pathname: "/(tabs)/(home)/category/[code]",
      params: { code: code }
    })
  };

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    }
  });

  const opacityStyle = useAnimatedStyle(() => {

    const opacity = scrollY.value > 24 ? 1 : 0
    return {opacity}
  });

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
        flex: 1,
      }}
    >
      <AnimatedMaskedView
        style={[{
          position: "absolute",
          top: 0,
          right: 0,
          left: 0,
          height: insets.top + 32,
          zIndex: 100,
        }, opacityStyle]}
        maskElement={
          <LinearGradient
            style={StyleSheet.absoluteFill}
            colors={['rgba(11, 11, 11, 1)', 'rgba(11, 11, 11, 0)']}
            start={{x: 0, y: 0.2}}
            end={{x: 0, y: 1}}
          />
        }
      >
        <BlurView
          intensity={16}
          style={{
            height: '100%',
            width: '100%',
            backgroundColor: "rgba(11, 11, 11, 0.6)"
          }}
        />
      </AnimatedMaskedView>

      <Animated.ScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
        style={{
          paddingBottom: 180,
          backgroundColor: "rgb(11, 11, 11)"
        }}
        contentContainerStyle={{
          paddingBottom: 170,
          paddingTop: insets.top
        }}
        onScroll={onScroll}
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
                    onPress={() => { onPress('Popular', CATEGORIES.ALL) }}
                  />
                  <Section title={'History'} data={podcastsData.history} tab='home'
                    onPress={() => { onPress('History', CATEGORIES.HISTORY) }}
                  />
                  <Section title={'Comedy'} data={podcastsData.comedy} tab='home'
                    onPress={() => { onPress('Comedy', CATEGORIES.COMEDY) }}
                  />
                  <Section title={'Education'} data={podcastsData.education} tab='home'
                    onPress={() => { onPress('Education', CATEGORIES.EDUCATION) }}
                  />
                  <Section title={'Technology'} data={podcastsData.technology} tab='home'
                    onPress={() => { onPress('Technology', CATEGORIES.TECHNOLOGY) }}
                  />
                  <Section title={'Science'} data={podcastsData.science} tab='home'
                    onPress={() => { onPress('Science', CATEGORIES.SCIENCE) }}
                  />
                  <Section title={'Business'} data={podcastsData.business} tab='home'
                    onPress={() => { onPress('Business', CATEGORIES.BUSINESS) }}
                  />
                  <Section title={'True Crime'} data={podcastsData.trueCrime} tab='home'
                    onPress={() => { onPress('True Crime', CATEGORIES.TRUE_CRIME) }}
                  />
                  <Section title={'News'} data={podcastsData.news} tab='home'
                    onPress={() => { onPress('News', CATEGORIES.NEWS) }}
                  />
                  <Section title={'Health & Fitness'} data={podcastsData.health} tab='home'
                    onPress={() => { onPress('Health & Fitness', CATEGORIES.HEALTH) }}
                  />
                  <Section title={'Fiction'} data={podcastsData.fiction} tab='home'
                    onPress={() => { onPress('Fiction', CATEGORIES.FICTION) }}
                  />
                </View>
              )
            }
          </View>

        </>
      </Animated.ScrollView>
    </View>


  );
};

export default HomeScreen;