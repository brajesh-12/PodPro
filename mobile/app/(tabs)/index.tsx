import { View, Text, FlatList, ScrollView } from 'react-native';
import Header from '@/components/Header';
import Trending from '@/components/Trending';
import {filter} from '../../constants/filter';

const index = () => {
  return (
    <ScrollView>
      <Header screen='home'/>
      <FlatList 
        horizontal= {true}
        showsHorizontalScrollIndicator= {false}
        data={filter}
        keyExtractor={(item) => item.id}
        renderItem={({item}) => {
          return (
            <View
              style={{
                paddingHorizontal: 10,
                paddingVertical: 6,
                borderRadius: 8,
                backgroundColor: 'rgba(0, 0, 0, 0.14)'
              }}
            >
              <Text
                style={{
                  fontFamily: "SF Pro",
                  fontSize: 14,
                  fontWeight: 500,
                  lineHeight: 16,
                  color: 'white'
                }}
              >
                {item.category}
              </Text>
            </View>
          )
        }}
        contentContainerStyle={{
          flexDirection: 'row',
          gap: 8,
          paddingLeft: 20,
          paddingVertical: 6,
        }}
        style={{
          height: 40,
          marginBottom: 12,
          flexGrow: 0,
          flexShrink: 0
        }}
      />
      <Trending />
    </ScrollView>
  )
}

export default index;