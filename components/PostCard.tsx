import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { PostType, UserType } from "@/types";
import { Router } from "expo-router";

const PostCard = ({
  item,
  currentUser,
  router,
}: {
  item: PostType;
  currentUser: UserType;
  router: Router;
}) => {
  console.log("----------", item);
  return (
    <View>
      <Text>{item.body}</Text>
      <Text>{item.userId}</Text>
      <Text>{item.created_at}</Text>
    </View>
  );
};

export default PostCard;

const styles = StyleSheet.create({});
