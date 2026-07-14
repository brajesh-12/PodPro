import { useRouter } from "expo-router";
import { Podcast } from "@/store/usePodcastStore";
import { TouchableOpacity, View, Text } from "react-native";
import { Image } from "expo-image";
import useModalStore from "@/store/useModalStore";

const PodcastCard = ({ item, tab }: { item: Podcast, tab: string }) => {
  const router = useRouter();
  const { openModal, setTappedPodcast } = useModalStore();

  return (
    <TouchableOpacity
      onPress={() => {
        if (tab === 'home') {
          router.navigate({
            pathname: "/(tabs)/(home)/podcast/[id]",
            params: { id: item.id }
          })
        } else if (tab === 'search') {
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
        marginBottom: 20
      }}
    >

      {/* Thumbail container */}
      <View
        style={{
          height: 168.5,
          width: 168.5
        }}
      >
        <Image
          source={{ uri: item.thumbnail }}
          style={{
            height: '100%',
            width: '100%',
            borderRadius: 8
          }}
          contentFit='cover'
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
  );
};

export default PodcastCard;