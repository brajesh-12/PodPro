import { Tabs } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Library } from "lucide-react-native";

const TabLayout = () => {
  return (
    <Tabs screenOptions={{ 
      tabBarActiveTintColor: 'blue',
      headerShown: false
     }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <FontAwesome size={22} name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="podcasts"
        options={{
          title: 'Podcasts',
          tabBarIcon: ({ color }) => <FontAwesome size={22} name="cog" color={color} />,
        }}
      />

      <Tabs.Screen 
        name="library"
        options={{
          title: "Library",
          tabBarIcon: ({color}) => <Library size={22} color={color} />
        }}
      />
    </Tabs>
  );
};

export default TabLayout;