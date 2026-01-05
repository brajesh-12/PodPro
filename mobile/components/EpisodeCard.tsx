import { View, Text } from 'react-native';
import React from 'react';
import { ArrowDownToLine, CirclePlay, EllipsisVertical, Save } from 'lucide-react-native';

interface Episode {
  id: string,
  podcast: string,
  brief: string,
  title: string,
  date: string,
  playTime: string
}

const EpisodeCard: React.FC<{data: Episode}> = ({data}) => {
  return (
    <View
      style={{
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderBottomWidth: 0.8,
        borderBottomColor: 'grey'
      }}
    >

      {/* Top Section */}
      <View
        style={{
          marginBottom: 8
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            gap: 12,
            alignItems: 'center'
          }}
        >
          {/* Left side */}
          <View
            style={{
              flexDirection: "row",
              alignItems: 'center',
              gap: 12,
              marginBottom: 8
            }}
          >
            <View
              style={{
                height: 72,
                width: 72,
                borderRadius: 4,
                backgroundColor: 'grey'
              }}
            ></View>

            <View
              style={{
                flexDirection: 'column',
                gap: 4,
              }}
            >
              <Text
                numberOfLines={2}
                ellipsizeMode='tail'
                style={{
                  fontFamily: "SF Pro",
                  fontSize: 16,
                  fontWeight: '600',
                  lineHeight: 24,
                  width: 237
                }}
              >
                {data.title}
              </Text>

              <Text
                style={{
                  fontFamily: "SF Pro",
                  fontSize: 14,
                  fontWeight: '400',
                  lineHeight: 16
                }}
              >
                {data.podcast}
              </Text>
            </View>
          </View>

          {/* Right side */}
          <View>
            <EllipsisVertical size={20} strokeWidth={2} />
          </View>
        </View>

        {/* Description Section */}
        <Text
          numberOfLines={2}
          ellipsizeMode='tail'
          style={{
            width: 353,
            fontFamily: "SF Pro",
            fontSize: 14,
            lineHeight: 20,
            fontWeight: '400'
          }}
        >
          {data.brief}
        </Text>
      </View>

      {/* Bottom Section */}
      <View
        style={{
          flexDirection: 'row',
          height: 32,
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        {/* Left Section */}
        <View>
          <Text
            style={{
              fontFamily: "SF Pro",
              fontSize: 14,
              fontWeight: '400',
              lineHeight: 20
            }}
          >
            {data.date} &#xB7; {data.playTime}
          </Text>
        </View>

        <View
          style={{
            flexDirection: 'row',
            gap: 16
          }}
        >
          <ArrowDownToLine size={22} strokeWidth={2}/>
          <Save size={22} strokeWidth={2}/>
          <CirclePlay size={22} strokeWidth={2}/>
        </View>
      </View>
    </View>
  )
}

export default EpisodeCard;