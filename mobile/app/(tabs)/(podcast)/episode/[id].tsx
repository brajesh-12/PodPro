import { View, Text, TouchableOpacity, ScrollView, Pressable } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Download, EllipsisVertical, Play, Search, Share } from 'lucide-react-native';
import { Image } from 'expo-image';
import { useEffect } from 'react';
import { formatDate, formatDuration } from '@/lib/utils';
import usePlayerStore from '@/store/usePlayerStore';
import useSubscriptionStore from '@/store/useSubscriptionStore';
import useModalStore from '@/store/useModalStore';

const EpisodeDetail = () => {
  const router = useRouter();
  const { id: episodeId } = useLocalSearchParams();
  // const { getEpisodeById, selectedEpisode, podcast } = usePodcastStore();
  const { selectedEpisode, setSelectedEpisode, followingPodcasts } = useSubscriptionStore();
  const { setActiveEpisode } = usePlayerStore()
  const { setTappedEpisode, setPodcastId, openGlobalModal } = useModalStore();

  const getPodcastId = (docId: any) => {
    const podcast = followingPodcasts.find((pod) => pod.podcastId === docId);
    if(podcast) {
      return podcast.id;
    }
    return null;
  };

  const podId = getPodcastId(selectedEpisode?.podcastId);

  useEffect(() => {
    const id = Array.isArray(episodeId) ? episodeId[0] : episodeId;
    if (id) {
      setSelectedEpisode(id);
    }
  }, [episodeId, setSelectedEpisode]);

  const handlePlay = () => {
    setActiveEpisode({
      id: episodeId,
      title: selectedEpisode?.title,
      audioUrl: selectedEpisode?.audioUrl,
      podcastId: selectedEpisode?.podcastId,
      image: selectedEpisode?.image,
      podcastTitle: selectedEpisode?.podcastTitle
    });
  }

  return (
    <ScrollView>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          height: 48,
          paddingLeft: 12,
          paddingRight: 8
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            alignItems: "center",
            justifyContent: "center",
            height: 36,
            width: 36,
            borderRadius: 72
          }}
        >
          <ArrowLeft size={24} strokeWidth={2} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.navigate({
            pathname: '/search'
          })}
          style={{
            alignItems: "center",
            justifyContent: "center",
            height: 36,
            width: 36,
            borderRadius: 72
          }}
        >
          <Search size={24} strokeWidth={2} />
        </TouchableOpacity>
      </View>

      {/* top container */}
      <View
        style={{
          borderBottomWidth: 0.6,
          borderBottomColor: "grey"
        }}
      >

        {/* Podcast Title */}
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            height: 20,
            marginBottom: 16
          }}
        >
          <Text
            style={{
              fontFamily: "SF Pro",
              fontSize: 14,
              fontWeight: "400",
              lineHeight: 16,
            }}
          >
            {selectedEpisode?.podcastTitle}
          </Text>
        </View>

        {/* Thumnail and duration */}
        <View
          style={{
            gap: 8,
            paddingTop: 8,
            paddingBottom: 12,
            alignItems: "center",
            justifyContent: "center"
          }}
        >

          <View
            style={{
              height: 180,
              width: 180,
              backgroundColor: "grey",
              borderRadius: 4
            }}
          >
            <Image
              source={{ uri: selectedEpisode?.image }}
              style={{
                height: "100%",
                width: "100%",
                borderRadius: 4
              }}
            />
          </View>

          <View
            style={{
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <Text
              style={{
                fontFamily: "SF Pro",
                fontSize: 14,
                fontWeight: "400",
                lineHeight: 16,
                textAlign: "center"
              }}
            >
              {formatDate(selectedEpisode?.publishDate)} &#8226; {formatDuration(selectedEpisode?.duration)}
            </Text>
          </View>

        </View>

        {/* Episode Title */}
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 16
          }}
        >
          <View
            style={{
              flexDirection: "column",
              alignItems: "center",
              width: 288,
            }}
          >
            <Text
              style={{
                fontFamily: "SF Pro",
                fontSize: 24,
                fontWeight: "700",
                lineHeight: 32,
                width: 288,
                textAlign: "center"
              }}
            >
              {selectedEpisode?.title}
            </Text>

          </View>
        </View>

        {/* CTAs buttons */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 12,
            gap: 12
          }}
        >

          <View
            style={{
              height: 44,
              width: 44,
              borderRadius: 88,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgb(217, 217, 217)"
            }}
          >
            <Download size={22} strokeWidth={2} />
          </View>

          <View
            style={{
              height: 44,
              width: 44,
              borderRadius: 88,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgb(217, 217, 217)"
            }}
          >
            <Share size={22} strokeWidth={2} />
          </View>

          <TouchableOpacity
            onPress={() => handlePlay()}
            style={{
              height: 64,
              width: 64,
              borderRadius: 128,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgb(217, 217, 217)"
            }}
          >
            <Play size={22} strokeWidth={2} fill={"black"} />
          </TouchableOpacity>

          <View
            style={{
              height: 44,
              width: 44,
              borderRadius: 88,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgb(217, 217, 217)"
            }}
          >
            <Download size={22} strokeWidth={2} />
          </View>

          <Pressable
            onPress={() => {
              openGlobalModal('episode')
              setTappedEpisode(selectedEpisode);
              setPodcastId(podId);
            }}
            style={{
              height: 44,
              width: 44,
              borderRadius: 88,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgb(217, 217, 217)"
            }}
          >
            <EllipsisVertical size={22} strokeWidth={2} />
          </Pressable>

        </View>
      </View>

      <View
        style={{
          paddingHorizontal: 20,
          paddingTop: 16
        }}
      >
        <Text
          style={{
            fontFamily: "SF Pro",
            fontSize: 14,
            fontWeight: "400",
            lineHeight: 20
          }}
        >
          {selectedEpisode?.description}
        </Text>
      </View>

    </ScrollView>
  )
}

export default EpisodeDetail;