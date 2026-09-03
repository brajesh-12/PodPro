import { View, Text, TouchableOpacity, Pressable, TextLayoutEvent } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { Image } from 'expo-image';
import { Podcast } from '@/store/usePodcastStore';
import { Star } from 'lucide-react-native';
import useSubscriptionStore from '@/store/useSubscriptionStore';
import { Follow, Unfollow } from '@/Icons-assets/Icon';
import ButtonStyle from '@/constants/buttonStyles';



const PodInfo: React.FC<{ podcast: Podcast | null, description: string | undefined }> = ({ podcast, description }) => {
  const { toggleSubscription, subscriptionIds } = useSubscriptionStore();

  const [isExpanded, setIsExpanded] = useState(false);
  const [hasMeasured, setHasMeasured] = useState(false);
  const [showMoreButton, setShowMoreButton] = useState(false);

  useEffect(() => {
    setIsExpanded(false);
    setHasMeasured(false);
    setShowMoreButton(false);
  }, [description]);

  const isSubscribed = podcast?.id !== undefined ? subscriptionIds.has(podcast?.id) : false;

  const handleTextLayout = useCallback(
    (event: TextLayoutEvent) => {
      if (!hasMeasured) {
        if (event.nativeEvent.lines.length > 2) {
          const numberOfLines = event.nativeEvent.lines.length
          console.log("Number of lines:", numberOfLines);
          setShowMoreButton(true);
        }
      }
      setHasMeasured(true);
    },
    [hasMeasured]
  );


  if (!podcast) {
    return <View><Text>Loading...</Text></View>
  }

  const genres = podcast.genres;

  return (
    <View>

      {/* Thumbnail container */}
      <View
        style={{
          height: 212,
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <View
          style={{
            height: 180,
            width: 180,
            borderRadius: 4,
            backgroundColor: "rgb(217, 217, 217)"
          }}
        >
          <Image
            source={{ uri: podcast.thumbnail }}
            style={{
              height: "100%",
              width: "100%",
              borderRadius: 4
            }}
          />
        </View>
      </View>

      {/* Second Section, text and CTA */}
      <View
        style={{
          flexDirection: "column",
          gap: 8,
          marginBottom: 24,
          alignItems: "center"
        }}
      >

        {/* Text container */}
        <View
          style={{
            flexDirection: "column",
            gap: 2,
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: 50.5
          }}
        >
          <Text
            numberOfLines={2}
            style={{
              width: 292,
              fontFamily: "SF Pro",
              fontSize: 24,
              fontWeight: "600",
              lineHeight: 32,
              textAlign: "center",
              color: "rgba(255, 255, 255, 0.9)"
            }}
          >
            {podcast.title}
          </Text>

          <Text
            style={{
              fontFamily: "SF Pro",
              fontSize: 14,
              fontWeight: "500",
              lineHeight: 16,
              color: "rgba(255, 255, 255, 0.6)"
            }}
          >
            {podcast.artist}
          </Text>
        </View>
      </View>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: 50.5,
          marginBottom: 24
        }}
      >

        {/* Button */}
        <TouchableOpacity
          onPress={() => toggleSubscription(podcast.id)}
          style={[{
            height: 50,
            borderRadius: 128,
            alignItems: "center",
            backgroundColor: 'rgba(255, 255, 255, 0.04)',
            flexDirection: "row",
            paddingHorizontal: 16,
            justifyContent: "space-between"
          }, ButtonStyle.buttonGroup]}
        >
          <View
            style={{
              paddingHorizontal: 12
            }}
          >
            {isSubscribed
              ? <Unfollow size={22} color='rgb(255, 255, 255)' />
              : <Follow size={22} color='rgb(255, 255, 255)' />
            }
          </View>
          <Text
            style={{
              fontFamily: "SF Pro",
              fontSize: 17,
              fontWeight: "500",
              lineHeight: 28,
              color: "rgb(255, 255, 255)",
              letterSpacing: 0.3
            }}
          >
            {isSubscribed
              ? "Unfollow"
              : "Follow"
            }
          </Text>
        </TouchableOpacity>
      </View>

      {/* discription and other info */}
      <View
        style={{
          paddingHorizontal: 20
        }}
      >
        {description &&
          <View
            style={{
              paddingRight: !isExpanded ? 36 : 0
            }}
          >
            <Text
              onTextLayout={handleTextLayout}
              numberOfLines={hasMeasured && !isExpanded ? 2 : undefined}
              ellipsizeMode='tail'
              style={{
                color: "rgba(255, 255, 255, 0.8)",
                fontFamily: "SF Pro",
                fontSize: 14,
                fontWeight: "400",
                lineHeight: 20
              }}
            >
              {description}
            </Text>

            {showMoreButton && (
              <Pressable
                onPress={() => {
                  setIsExpanded(true);
                }}
                style={{
                  position: "absolute",
                  bottom: -2,
                  right: -6,
                  opacity: !isExpanded ? 1 : 0,
                  backgroundColor: "rgb(36, 36, 36)",
                  paddingHorizontal: 6,
                  paddingVertical: 3,
                  borderRadius: 12
                }}
              >
                <Text
                  style={{
                    color: "rgb(255, 255, 255)",
                    fontFamily: "SF Pro",
                    fontWeight: "500",
                    fontSize: 14
                  }}
                >
                  MORE
                </Text>
              </Pressable>
            )}
          </View>
        }

        {/* Rating and genres */}

        <View
          style={{
            flexDirection: "row",
            paddingVertical: 12
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: "center"
            }}
          >
            <Star size={18} fill={'rgba(255, 255, 255, 0.9)'} />
            <Text
              style={{
                color: "rgba(255, 255, 255, 1)",
                fontFamily: "SF Pro",
                fontSize: 13,
                lineHeight: 16,
                fontWeight: "400"
              }}
            >
              4.8 (95)
            </Text>
          </View>

          {genres.map((genre) => (
            <Text key={genre}
              style={{
                color: "rgb(255, 255, 255)",
                paddingLeft: 3,
                fontFamily: "SF Pro",
                fontSize: 13,
                fontWeight: "400",
                lineHeight: 16
              }}
            >
              &middot; {genre}
            </Text>
          ))}
        </View>
      </View>

      {/* Tailer Part */}
    </View>
  )
}

export default PodInfo;