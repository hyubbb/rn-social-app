import { StyleSheet, Text, TextInput, View } from "react-native";
import React, { forwardRef } from "react";
import { theme } from "@/constants/themes";
import { hp } from "@/helpers/commons";

const Input = forwardRef((props: any, ref?: any) => {
  return (
    <View style={[styles.container, props?.containerStyles]}>
      {props?.icon}
      <TextInput
        style={{ flex: 1 }}
        keyboardType={props?.keyboardType || "default"}
        placeholderTextColor={theme.colors.textLight}
        ref={ref}
        autoCapitalize='none'
        secureTextEntry={props?.secureTextEntry}
        {...props}
      />
    </View>
  );
});

export default Input;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    height: hp(7),
    alignItems: "center",
    borderWidth: 0.4,
    borderColor: theme.colors.text,
    borderRadius: theme.radius.xxl,
    borderCurve: "continuous",
    paddingHorizontal: 18,
    gap: 12,
  },
});
