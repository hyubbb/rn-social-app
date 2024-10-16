import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { hp } from "@/helpers/commons";
import { theme } from "@/constants/themes";
import { Image } from "expo-image";
import { getUserImageSrc } from "@/service/imageService";

type AvatarProps = {
  uri: string;
  size?: number;
  rounded?: number;
  style?: any;
};

const Avatar = ({
  uri,
  size = hp(3),
  rounded = theme.radius.md,
  style = {},
}: AvatarProps) => {
  return (
    <Image
      source={getUserImageSrc(uri)}
      transition={100}
      style={[
        styles.avatar,
        { height: size, width: size, borderRadius: rounded },
        style,
      ]}
    />
  );
};

export default Avatar;

const styles = StyleSheet.create({
  avatar: {
    borderCurve: "continuous",
    borderColor: theme.colors.darkLight,
    // borderRadius: theme.radius.sm,
    // borderWidth: 0,
  },
});
