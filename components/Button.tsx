import { Text, View, StyleSheet, Pressable } from "react-native";
import React from "react";
import { theme } from "@/constants/themes";
import { hp } from "@/helpers/commons";
import Loading from "./Loading";

type ButtonProps = {
  buttonStyle?: Object;
  textStyle?: Object;
  title: string;
  onPress: () => void;
  loading?: boolean;
  hasShadow?: boolean;
};

const Button = ({
  buttonStyle,
  textStyle,
  title = "",
  onPress = () => {},
  loading = false,
  hasShadow = true,
}: ButtonProps) => {
  const shadowStyles = {
    shadowColor: theme.colors.dark,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  };
  if (loading) {
    return (
      <View
        style={[styles.buttonStyle, buttonStyle, { backgroundColor: "white" }]}
      >
        <Loading />
      </View>
    );
  }

  return (
    <Pressable
      style={[styles.buttonStyle, buttonStyle, hasShadow && shadowStyles]}
      onPress={onPress}
    >
      <Text style={[styles.text, textStyle]}>{title}</Text>
    </Pressable>
  );
};

export default Button;

const styles = StyleSheet.create({
  buttonStyle: {
    backgroundColor: theme.colors.primary,
    height: hp(6),
    justifyContent: "center",
    alignItems: "center",
    borderCurve: "continuous",
    borderRadius: theme.radius.xl,
  },
  text: {
    fontSize: hp(2.5),
    fontFamily: theme.fonts.bold,
    color: "white",
  },
});
