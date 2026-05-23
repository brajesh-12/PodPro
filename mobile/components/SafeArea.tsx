import { useSafeAreaInsets } from "react-native-safe-area-context";
import { View } from "react-native";
import React from 'react';

interface SafeAreaProps {
  children: React.ReactNode;
  backgroundColor: string
}

const SafeArea:React.FC<SafeAreaProps> = ({children, backgroundColor}) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        paddingTop: insets.top,
        flex: 1,
        backgroundColor: "tranparent",
      }}
    >
      {children}
    </View>
  );
};

export default SafeArea;