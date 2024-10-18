import { View, Text, StyleSheet, Button, LogBox } from "react-native";
import React from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import { useRouter } from "expo-router";
import Loading from "@/components/Loading";

LogBox.ignoreLogs([
  "Warning: TRenderEngineProvider:",
  "Warning: MemoizedTNodeRenderer:",
  "Warning: TNodeChildrenRenderer:",
]);
const index = () => {
  const router = useRouter();
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Loading />
    </View>
  );
};

export default index;

const styled = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
