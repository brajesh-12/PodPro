import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Download, EllipsisVertical, Play, Share } from 'lucide-react-native';
import { Image } from 'expo-image';
import { useEffect } from 'react';
import { usePodcastStore } from '@/store/usePodcastStore';
import { formatDate, formatDuration } from '@/lib/utils';
import usePlayerStore from '@/store/usePlayerStore';

const EpisodeDetail = () => {
  const router = useRouter();
  const { id: episodeId } = useLocalSearchParams();
  const { getEpisodeById, selectedEpisode, podcast } = usePodcastStore();
  const { setActiveEpisode } = usePlayerStore()

  useEffect(() => {
    getEpisodeById(episodeId);
  }, [episodeId, getEpisodeById]);

  const handlePlay = () => {
    setActiveEpisode({
      id: episodeId,
      title: selectedEpisode?.title,
      audioUrl: selectedEpisode?.audioUrl,
      podcastId: podcast?.id,
      image: podcast?.thumbnail,
      podcastTitle: podcast?.podcastTitle
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
          style={{
            alignItems: "center",
            justifyContent: "center",
            height: 36,
            width: 36,
            borderRadius: 72
          }}
        >
          <EllipsisVertical size={24} strokeWidth={2} />
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
            {podcast?.podcastTitle}
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
              source={{ uri: podcast?.thumbnail }}
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
            <EllipsisVertical size={22} strokeWidth={2} />
          </View>

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