import { View, Text, TouchableOpacity, Pressable, ScrollView } from 'react-native';
import { Cast, Bell, Search, ChevronDown, ArrowLeft } from 'lucide-react-native';
import useSubscriptionStore from '@/store/useSubscriptionStore';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { filter } from '@/constants/filter';

interface Screen {
  screen: string
}

const Header: React.FC<Screen> = ({ screen }) => {
  const router = useRouter();

  return (
    // this is main container
    <View
      style={{
        height: 48,
        flexDirection: 'row',
        paddingLeft: 20,
        paddingRight: 12,
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8
      }}
    >
      {/* Left container */}

      {
        screen === 'home' ?
          (
            <View
              style={{
                flexDirection: 'row',
                gap: 8,
                alignItems: 'center'
              }}
            >
              <View
                style={{
                  height: 32,
                  width: 32,
                  backgroundColor: "grey",
                  borderRadius: 64
                }}
              ></View>
              <View
                style={{
                  flexDirection: 'column',
                }}
              >
                <Text
                  style={{
                    fontFamily: "SF Pro",
                    fontSize: 12,
                    lineHeight: 16,
                    color: 'grey'
                  }}
                >
                  Welcome Back!
                </Text>
                <Text
                  style={{
                    fontFamily: "SF Pro",
                    fontSize: 16,
                    fontWeight: "500",
                    lineHeight: 20,
                  }}
                >
                  Brajesh
                </Text>
              </View>
            </View>
          )
          : screen === 'library' ? (
            <View
              style={{
                flexDirection: 'row',
                gap: 4,
                alignItems: 'center'
              }}
            >
              <Text
                style={{
                  fontFamily: "SF Pro",
                  fontSize: 18,
                  fontWeight: 600,
                  lineHeight: 28
                }}
              >
                Library
              </Text>
              <ChevronDown size={16} strokeWidth={2} />
            </View>
          ) : (
            <View
              style={{
                flexDirection: 'row',
                gap: 4,
                alignItems: 'center'
              }}
            >
              <Text
                style={{
                  fontFamily: "SF Pro",
                  fontSize: 18,
                  fontWeight: 600,
                  lineHeight: 28
                }}
              >
                Podcasts
              </Text>
              <ChevronDown size={16} strokeWidth={2} />
            </View>
          )
      }


      {/* Right container/Icon container */}
      <View
        style={{
          flexDirection: 'row',
          gap: 2
        }}
      >
        <View
          style={{
            height: 36,
            width: 36,
            borderRadius: 72,
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Cast size={22} strokeWidth={2} />
        </View>

        <View
          style={{
            height: 36,
            width: 36,
            borderRadius: 72,
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Bell size={22} strokeWidth={2} />
        </View>

        <TouchableOpacity
          onPress={() => {
            router.navigate({
              pathname: "/search"
            })
          }}
          style={{
            height: 36,
            width: 36,
            borderRadius: 72,
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Search size={22} strokeWidth={2} />
        </TouchableOpacity>
      </View>
    </View>
  )
}

export const SubscriptionHeader = () => {
  const router = useRouter();

  const { isSelected, setIsSelected, followingPodcasts, selectedPodcast, setSelectedPodcast, singlePodFeed, fetchFeed } = useSubscriptionStore();

  return (
    <View>
      {/* top */}
      <View
        style={{
          height: 48,
          flexDirection: 'row',
          paddingLeft: 20,
          paddingRight: 12,
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 8
        }}
      >

        {/* left side */}
        <View>
          {
            !isSelected
              ? (<Text
                style={{
                  fontFamily: "SF Pro",
                  fontSize: 18,
                  fontWeight: 600,
                  lineHeight: 28
                }}
              >
                Podcasts
              </Text>
              )
              : (
                <Pressable
                  onPress={() => {
                    setIsSelected(false);
                    fetchFeed(1);
                  }}
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    height: 36,
                    width: 36,
                    borderRadius: 72
                  }}
                >
                  <ArrowLeft size={24} />
                </Pressable>
              )
          }
        </View>

        {/* Left container */}
        <View
          style={{
            flexDirection: 'row',
            gap: 2
          }}
        >
          <View
            style={{
              height: 36,
              width: 36,
              borderRadius: 72,
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Cast size={22} strokeWidth={2} />
          </View>

          <View
            style={{
              height: 36,
              width: 36,
              borderRadius: 72,
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Bell size={22} strokeWidth={2} />
          </View>

          <TouchableOpacity
            onPress={() => {
              router.navigate({
                pathname: "/search"
              })
            }}
            style={{
              height: 36,
              width: 36,
              borderRadius: 72,
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Search size={22} strokeWidth={2} />
          </TouchableOpacity>
        </View>

      </View>

      {/* followed podcasts */}
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingLeft: 20,
        }}
      >
        {followingPodcasts.map((pod) => (
          <TouchableOpacity
            onPress={() => {
              setSelectedPodcast(pod);
              singlePodFeed(1);
            }}
            key={pod.id}
            style={{
              flexDirection: "column",
              gap: 4,
              flexWrap: 'wrap',
              paddingHorizontal: 6,
              height: 90,
              alignItems: 'center'
            }}
          >
            <View
              style={{
                height: 56,
                width: 56,
                borderRadius: 112,
                backgroundColor: 'grey'
              }}
            >
              <Image
                source={{ uri: pod.thumbnail }}
                style={{
                  height: "100%",
                  width: "100%",
                  borderRadius: 112
                }}
                contentFit="contain"
              />
            </View>

            <Text
              numberOfLines={1}
              ellipsizeMode='tail'
              style={{
                fontFamily: "SF Pro",
                fontSize: 12,
                fontWeight: '500',
                lineHeight: 16,
                width: 56,
                textAlign: 'center'
              }}
            >
              {pod.title}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Botton container filter/cta(when isSelected === true) */}
      {
        isSelected
          ? (
            <View>
              <Pressable
                onPress={() => {
                  router.navigate({
                    pathname: "/(tabs)/(podcast)/[podcastId]",
                    params: { podcastId: `${selectedPodcast?.id}` }
                  })
                }}
                style={{
                  height: 32,
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <Text
                  style={{
                    fontFamily: "SF Pro",
                    fontSize: 16,
                    fontWeight: "600",
                    lineHeight: 24
                  }}
                >
                  View Podcast
                </Text>
              </Pressable>
            </View>
          )
          : (
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                flexDirection: 'row',
                gap: 8,
                paddingLeft: 20,
                paddingVertical: 6,
                height: 40,
                justifyContent: 'center'
              }}
            >
              {filter.map((item) => (
                <View
                  key={item.id}
                  style={{
                    paddingHorizontal: 10,
                    paddingVertical: 6,
                    borderRadius: 8,
                    backgroundColor: 'rgba(0, 0, 0, 0.14)'
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "SF Pro",
                      fontSize: 14,
                      fontWeight: 500,
                      lineHeight: 16,
                      color: 'white'
                    }}
                  >
                    {item.category}
                  </Text>
                </View>
              ))}
            </ScrollView>
          )
      }

    </View>


  )
}

export default Header;