import { View, Text } from "react-native";
import { EllipsisVertical } from "lucide-react-native";
import React from "react";

interface Playlist {
  id: string,
  title: string,
  subTitle: string
}

export const ListLayout: React.FC<{ playlist: Playlist }> = ({ playlist }) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: "space-between",
        gap: 12,
        alignItems: 'center',
        marginBottom: 12,
        paddingLeft: 20,
        paddingRight: 16
      }}
    >
      {/* Left container */}
      <View
        style={{
          flexDirection: 'row',
          gap: 12,
          alignItems: 'center'
        }}
      >
        {/* thumbnail */}
        <View
          style={{
            height: 64,
            width: 64,
            borderRadius: 4,
            backgroundColor: 'grey'
          }}
        ></View>

        {/* Text conatiner */}
        <View>
          <Text
            style={{
              fontFamily: "SF Pro",
              fontSize: 16,
              fontWeight: '500',
              lineHeight: 24
            }}
          >
            {playlist.title}
          </Text>
          <Text
            style={{
              fontFamily: "SF Pro",
              fontSize: 14,
              fontWeight: "400",
              lineHeight: 20
            }}
          >
            {playlist.subTitle}
          </Text>
        </View>
      </View>

      {/* Right conatiner */}
      <View
        style={{
          height: 30,
          width: 30,
          borderRadius: 60
        }}
      >
        <EllipsisVertical size={20} strokeWidth={2} />
      </View>
    </View>
  )
}

export const BoardLayout: React.FC<{ playlist: Playlist }> = ({ playlist }) => {
  return (
    <View
      style={{
        flexDirection: 'column',
        gap: 8,
        marginBottom: 16
      }}
    >
      <View
        style={{
          height: 168,
          width: 168,
          borderRadius: 6,
          backgroundColor: 'grey'
        }}
      ></View>

      <View
        style={{
          flexDirection: "column",
          gap: 0
        }}
      >
        <Text
          style={{
            fontFamily: "SF Pro",
            fontSize: 16,
            fontWeight: "500",
            lineHeight: 24
          }}
        >
          {playlist.title}
        </Text>

        <Text
          style={{
            fontFamily: "SF Pro",
            fontSize: 14,
            fontWeight: "400",
            lineHeight: 20
          }}
        >
          {playlist.subTitle}
        </Text>
      </View>
    </View>
  );
};