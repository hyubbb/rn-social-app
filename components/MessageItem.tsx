import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { MessageType, MessageTypeWithUser } from "@/types";
import Avatar from "./Avatar";
import { wp } from "@/helpers/commons";
import { useAuth } from "@/contexts/AuthContext";

const MessageItem = ({ item }: { item: MessageTypeWithUser }) => {
  const { user } = useAuth();
  const isMine = item.user_id == user?.id;

  return (
    <View style={[styles.container]}>
      {!isMine && (
        <View style={styles.userInfo}>
          <>
            <Avatar uri={item?.user?.image || ""} size={wp(10)} />
            <Text>{item?.user?.name}</Text>
          </>
        </View>
      )}
      <Text style={[styles.content, isMine && styles.mineContainer]}>
        {item?.content}
      </Text>
    </View>
  );
};

export default MessageItem;

const styles = StyleSheet.create({
  container: {
    gap: 10,
    // alignItems: "center",
  },
  userInfo: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  content: {
    backgroundColor: "#ffffff",
    padding: 10,
    paddingHorizontal: 13,
    width: "auto",
    borderRadius: 8,
    overflow: "hidden",
    alignSelf: "flex-start",
  },
  mineContainer: {
    backgroundColor: "#5ad8004f",
    alignSelf: "flex-end",
    // alignItems: "flex-end",
  },
});
