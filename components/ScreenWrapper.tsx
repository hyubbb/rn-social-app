import { View, Text } from "react-native";
import React, { ReactNode } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { wp } from "@/helpers/commons";

const ScreenWrapper = ({
  children,
  bg,
}: {
  children: ReactNode;
  bg?: string;
}) => {
  const { top } = useSafeAreaInsets();
  const paddingTop = top > 0 ? top + 5 : 30;

  return (
    <View
      style={{
        flex: 1,
        paddingTop,
        backgroundColor: bg,
        paddingHorizontal: wp(4),
      }}
    >
      {children}
    </View>
  );
};

export default ScreenWrapper;
