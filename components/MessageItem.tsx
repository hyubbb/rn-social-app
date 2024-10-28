import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { MessageType, MessageTypeWithUser } from "@/types";
import Avatar from "./Avatar";
import { wp } from "@/helpers/commons";

const MessageItem = ({ item }: { item: MessageTypeWithUser }) => {
  return (
    <View style={styles.container}>
      <Avatar uri={item?.user?.image || ""} size={wp(10)} />
      <Text>{item?.user?.name}</Text>
      <Text>{item?.content}</Text>
    </View>
  );
};

export default MessageItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    flex: 1,
  },
});
