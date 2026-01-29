import { View, Text, FlatList, TouchableOpacity } from 'react-native'
import { Image } from 'expo-image'
import { useRouter } from 'expo-router';

const Section = ({title, data}: { title: string; data: any[] }) => {
  const router = useRouter();

  return (
    <View
      style={{
        marginBottom: 32
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          paddingLeft: 20,
          height: 40,
          alignItems: 'center',
          marginBottom: 8
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
      </View>

      <FlatList
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        data={data}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          paddingLeft: 20
        }}
        renderItem={({item}) => {
          return (
            <TouchableOpacity
              onPress={() => router.navigate({
                pathname: "/(home)/podcast/[id]",
                params: {id: `${item.id}`}
              })}
              style={{
                flexDirection: 'column',
                gap: 8,
                marginRight: 16
              }}
            >

              {/* Thumbail container */}
              <View
                style={{
                  height: 146,
                  width: 146
                }}
              >
                <Image 
                  source={{uri: item.thumbnail}}
                  style={{
                    height: '100%',
                    width: '100%',
                    borderRadius: 4
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
                  {item.podcastTitle}
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