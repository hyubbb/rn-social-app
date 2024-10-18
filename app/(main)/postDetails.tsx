import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";

const postDetails = () => {
  const { postId } = useLocalSearchParams();
  return (
    <View>
      <Text>postDetails</Text>
    </View>
  );
};

export default postDetails;

const styles = StyleSheet.create({});
