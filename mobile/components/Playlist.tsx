import { View, Text, Pressable } from "react-native";
import { EllipsisVertical } from "lucide-react-native";
import React from "react";
import { Playlist } from "@/services/api";
import { useRouter } from "expo-router";
import { formatDate } from "@/lib/utils";
import useModalStore from "@/store/useModalStore";


export const ListLayout = ({ playlist }: { playlist: Playlist }) => {
  const router = useRouter();

  const { setIsOpen, setTappedPlaylist, setType } = useModalStore();

  return (
    <Pressable
      onPress={() => router.navigate({
        pathname: "/(tabs)/(library)/playlist/[id]",
        params: { id: `${playlist.id}` }
      })}
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
            numberOfLines={1}
            ellipsizeMode="tail"
            style={{
              fontFamily: "SF Pro",
              fontSize: 16,
              fontWeight: '500',
              lineHeight: 24,
              width: "100%"
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
            {playlist.type === 'Save' || playlist.type === 'Download'
              ? "Auto Playlist"
              : `createdAt ${formatDate(playlist.createdAt)}`
            }
          </Text>
        </View>
      </View>

      {/* Right conatiner */}
      <Pressable
        onPress={() => {
          setIsOpen(true);
          setType("playlist");
          setTappedPlaylist(playlist);
        }}
        style={{
          height: 30,
          width: 30,
          borderRadius: 60
        }}
      >
        <EllipsisVertical size={20} strokeWidth={2} />
      </Pressable>
    </Pressable>
  )
}

export const BoardLayout: React.FC<{ playlist: Playlist }> = ({ playlist }) => {
  const router = useRouter();
  const { setIsOpen, setTappedPlaylist, setType } = useModalStore();

  return (
    <Pressable
      onPress={() => router.navigate({
        pathname: "/(tabs)/(library)/playlist/[id]",
        params: { id: `${playlist.id}` }
      })}
      onLongPress={() => {
        setIsOpen(true);
        setType("playlist");
        setTappedPlaylist(playlist);
      }}
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
          numberOfLines={1}
          ellipsizeMode="tail"
          style={{
            fontFamily: "SF Pro",
            fontSize: 16,
            fontWeight: "500",
            lineHeight: 24,
            width: 168
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
          {playlist.type === 'Save' || playlist.type === 'Download'
            ? "Auto Playlist"
            : `createdAt ${formatDate(playlist.createdAt)}`
          }
        </Text>
      </View>
    </Pressable>
  );
};