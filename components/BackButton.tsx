import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Pressable } from "react-native";
import { theme } from "@/constants/themes";
import Icon from "@/assets/icons";
import { useRouter } from "expo-router";

const BackButton = ({ size = 26, router }: { size?: number; router: any }) => {
  return (
    <Pressable onPress={() => router.back()} style={styles.button}>
      <Icon name='chevron-back-outline' size={size} color={theme.colors.text} />
    </Pressable>
  );
};

export default BackButton;

const styles = StyleSheet.create({
  button: {
    alignSelf: "flex-start",
    padding: 5,
    borderRadius: theme.radius.sm,
    backgroundColor: "rgba(0,0,0,0.07)",
  },
});
