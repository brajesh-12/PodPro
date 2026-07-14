import { View, Text, FlatList, TouchableOpacity, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Podcast } from '@/store/usePodcastStore';
import useModalStore from '@/store/useModalStore';
import { ChevronRight } from 'lucide-react-native';

const Section = ({ title, data, tab, onPress }: { title: string; data: Podcast[]; tab: string, onPress: () => void}) => {
  const router = useRouter();

  const { setTappedPodcast, openModal } = useModalStore();

  return (
    <View
      style={{
        marginBottom: 32
      }}
    >
      <Pressable
        onPress={onPress}
        style={{
          flexDirection: 'row',
          paddingLeft: 20,
          height: 40,
          alignItems: 'center',
          marginBottom: 8,
          gap: 4
        }}
      >
        <Text
          style={{
            fontFamily: "SF Pro",
            fontSize: 20,
            fontWeight: '700',
            lineHeight: 28
          }}
        >
          {title}
        </Text>

        <ChevronRight size={22} strokeWidth={1.8} />
      </Pressable>

      <FlatList
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        data={data}
        keyExtractor={(item) => item.id.toString()}
        bounces={false}
        contentContainerStyle={{
          paddingLeft: 20
        }}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              onPress={() => {
                if (tab === "home") {
                  router.navigate({
                    pathname: "/(tabs)/(home)/podcast/[id]",
                    params: { id: item.id }
                  })

                } else if (tab === "search") {
                  router.navigate({
                    pathname: "/(tabs)/(search)/podcast/[id]",
                    params: { id: item.id }
                  })
                }
              }}
              onLongPress={() => {
                openModal('podcast');
                setTappedPodcast(item);
              }}
              style={{
                flexDirection: 'column',
                gap: 12,
                marginRight: 16
              }}
            >

              {/* Thumbail container */}
              <View
                style={{
                  height: 160,
                  width: 160
                }}
              >
                <Image
                  source={{ uri: item.thumbnail }}
                  style={{
                    height: '100%',
                    width: '100%',
                    borderRadius: 8
                  }}
                  contentFit="cover"
                />
              </View>

              {/* Text container */}
              <View
                style={{
                  flexDirection: 'column',
                  gap: 4
                }}
              >
                <Text
                  numberOfLines={1}
                  ellipsizeMode='tail'
                  style={{
                    width: 146,
                    fontFamily: "SF Pro",
                    fontWeight: '500',
                    fontSize: 14,
                    lineHeight: 16
                  }}
                >
                  {item.title}
                </Text>

                <Text
                  numberOfLines={1}
                  ellipsizeMode='tail'
                  style={{
                    width: 146,
                    fontFamily: "SF Pro",
                    fontWeight: '400',
                    fontSize: 14,
                    lineHeight: 16
                  }}
                >
                  {item.artist}
                </Text>
              </View>
            </TouchableOpacity>
          )
        }}
      />
    </View>
  )
}

export default Section;