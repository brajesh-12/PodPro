import { View, Text, Pressable } from "react-native";
import { EllipsisVertical } from "lucide-react-native";
import React from "react";
import { Playlist } from "@/services/api";
import { useRouter } from "expo-router";
import { formatDate } from "@/lib/utils";
import useModalStore from "@/store/useModalStore";
import { Image } from "expo-image";


export const ListLayout = ({ playlist }: { playlist: Playlist }) => {
  const router = useRouter();

  const { setTappedPlaylist, openPlaylistOptions } = useModalStore();

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
          }}
        >
          <Image
            style={{
              height: "100%",
              width: "100%",
              borderRadius: 4
            }}
            source={{ uri: playlist.image }}
          />
        </View>

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
              width: "100%",
              color: 'rgba(255, 255, 255, 0.9)'
            }}
          >
            {playlist.title}
          </Text>
          <Text
            style={{
              fontFamily: "SF Pro",
              fontSize: 14,
              fontWeight: "400",
              lineHeight: 20,
              color: 'rgba(255, 255, 255, 0.6)'
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
      {
        playlist.type === "custom" &&
        <Pressable
          onPress={() => {
            setTappedPlaylist(playlist);
            openPlaylistOptions("playlist");
          }}
          style={{
            height: 30,
            width: 30,
            borderRadius: 60
          }}
        >
          <EllipsisVertical size={20} strokeWidth={2} color={'rgb(255, 255, 255)'} />
        </Pressable>
      }
    </Pressable>
  );
};

export const BoardLayout: React.FC<{ playlist: Playlist }> = ({ playlist }) => {
  const router = useRouter();
  const { setTappedPlaylist, openPlaylistOptions } = useModalStore();

  return (
    <Pressable
      onPress={() => router.navigate({
        pathname: "/(tabs)/(library)/playlist/[id]",
        params: { id: `${playlist.id}` }
      })}
      onLongPress={() => {
        if(playlist.type === "custom") {
          setTappedPlaylist(playlist);
          openPlaylistOptions("playlist");
        }
        return;
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
        }}
      >
        <Image
          style={{
            height: '100%',
            width: '100%',
            borderRadius: 6
          }}
          source={{ uri: playlist.image }}
        />
      </View>

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
            width: 168,
            color: "rgba(255, 255, 255, 0.9)"
          }}
        >
          {playlist.title}
        </Text>

        <Text
          style={{
            fontFamily: "SF Pro",
            fontSize: 14,
            fontWeight: "400",
            lineHeight: 20,
            color: 'rgba(255, 255, 255, 0.6)'
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