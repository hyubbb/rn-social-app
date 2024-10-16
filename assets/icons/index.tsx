import { StyleSheet, Text, View } from "react-native";
import React from "react";
import Home from "./Home";
import MaterialIcons from "react-native-vector-icons/Ionicons";

type IconProps = {
  name: string;
  size?: number;
  color?: string;
};

const icons = {
  home: Home,
};

const Icon = ({ name, ...props }: IconProps) => {
  return (
    <MaterialIcons name={name} size={props.size || 24} color={props.color} />
  );
};

export default Icon;

const styles = StyleSheet.create({});
