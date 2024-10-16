import { ActivityIndicator, StyleSheet, View } from "react-native";
import React from "react";
import { theme } from "@/constants/themes";

type LoadingProps = {
  size?: "large" | "small" | number;
  color?: string;
};

const Loading = ({
  size = "large",
  color = theme.colors.primary,
}: LoadingProps) => {
  return (
    <View style={{ justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
};

export default Loading;

const styles = StyleSheet.create({});
