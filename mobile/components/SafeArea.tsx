import { useSafeAreaInsets } from "react-native-safe-area-context";
import { View } from "react-native";
import React from 'react';

interface SafeAreaProps {
  children: React.ReactNode;
}

const SafeArea:React.FC<SafeAreaProps> = ({children}) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        paddingTop: insets.top,
        flex: 1,
        backgroundColor: "null",
      }}
    >
      {children}
    </View>
  );
};

export default SafeArea;