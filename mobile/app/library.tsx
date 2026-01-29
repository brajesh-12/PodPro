import Header from '@/components/Header';
import { ChevronDown, LayoutGrid, List } from 'lucide-react-native';
import { View, Text, ScrollView, FlatList, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { BoardLayout, ListLayout } from '@/components/Playlist';
import { playlists } from '../constants/library';

const Library = () => {
  const [layout, setLayout] = useState(true);

  const handleLayout = () => {
    setLayout(!layout);
  }

  return (
    <ScrollView>
      <Header screen='library'/>

      {/* filter section */}
      <View
        style={{
          flexDirection: 'row',
          paddingHorizontal: 20,
          alignItems: 'center',
          justifyContent: 'space-between',
          height:40,
          marginBottom: 8
        }}
      >

        {/* Left container */}
        <View
          style={{
            flexDirection: "row",
            gap: 8,
            alignItems: 'center'
          }}
        >
          <Text
            style={{
              fontFamily: "SF Pro",
              fontWeight: "500",
              fontSize: 14,
              lineHeight: 16
            }}
          >
            Recent
          </Text>
          
          <ChevronDown size={16} strokeWidth={2}/>
        </View>

        {/* Right container */}
        <TouchableOpacity
          style={{
            height: 32,
            width: 32,
            borderRadius: 64,
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onPress={handleLayout}
        >
          {
            layout ? <LayoutGrid size={20} strokeWidth={2}/> : <List size={20} strokeWidth={2}/>
          }
        </TouchableOpacity>

      </View>

      {/* Playlists Layout */}

      <FlatList 
        key={layout ? 'list' : 'grid'}
        scrollEnabled= {false}
        data={playlists}
        keyExtractor={(item) => item.id}
        numColumns={layout ? 1 : 2}
        columnWrapperStyle={!layout && {
          gap: 16,
          paddingHorizontal: 20
        }}
        renderItem={({item}) => layout ? <ListLayout playlist={item} /> : <BoardLayout playlist={item}/>}
      />
    </ScrollView>
  )
}

export default Library;