import { View, Text, FlatList, ScrollView, Pressable } from 'react-native';
import Header from '@/components/Header';
import Trending from '@/components/Trending';
import Section from '@/components/Section';
import { usePodcastStore } from '@/store/usePodcastStore';
import { useEffect, useState } from 'react';
import { useNetworkStore } from '@/store/useNetworkStore';
import { categories } from '@/services/podcastAPI';
import PodcastCard from '@/components/PodcastCard';

const Index = () => {
  const { history, trending, fetchData, science, comedy, education, fetchFilterResult, filterResult } = usePodcastStore();
  const { isOnline } = useNetworkStore();

  const [selectedCategory, setSelectedCategory] = useState("All");
  const historyPods = history.slice(0, 10);
  const topTenResult = filterResult.slice(0, 10);
  const remainingResult = filterResult.slice(11, 20);

  const handleFilter = async (category: string, code: string) => {
    setSelectedCategory(category);
    fetchFilterResult(code);
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (!isOnline) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <Text>
          No Internet, Check downloads.
        </Text>
      </View>
    )
  }

  return (
    <ScrollView

    >
      <Header screen='home' />
      <FlatList
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        data={categories}
        keyExtractor={(item) => item.code}
        renderItem={({ item }) => {
          const isSelected = selectedCategory === item.name;
          return (
            <Pressable
              onPress={() => handleFilter(item.name, item.code)}
              style={{
                paddingHorizontal: 10,
                paddingVertical: 6,
                borderRadius: 8,
                backgroundColor: !isSelected ? 'rgba(0, 0, 0, 0.14)' : 'rgb(0, 0, 0)'
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
                {item.name}
              </Text>
            </Pressable>
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

      {selectedCategory !== "All"
        ? (
          <View>
            <Section title={`Most Popular in ${selectedCategory}`} data={topTenResult} />

            <View>
              {remainingResult.map((item) => (
                <View key={item.id}>
                  <PodcastCard podcast={item}/>
                </View>
              ))}
            </View>
          </View>
        )
        : (
          <>
            <Trending data={trending} />
            <Section title={'History'} data={historyPods} />
            <Section title={'Comedy'} data={comedy} />
            <Section title={'Education'} data={education} />
            <Section title={'Science'} data={science} />
          </>
        )
      }
    </ScrollView>
  )
}

export default Index;