import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { MessageType, MessageTypeWithUser } from "@/types";
import Avatar from "./Avatar";
import { wp } from "@/helpers/commons";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "expo-router";

const MessageItem = ({
  item,
  prevItem,
}: {
  item: MessageTypeWithUser;
  prevItem: MessageTypeWithUser | null;
}) => {
  const { user } = useAuth();
  const router = useRouter();
  const isMine = item.user_id == user?.id;
  const showUserInfo = !prevItem || prevItem.user.id !== item.user.id;

  return (
    <View style={[styles.container]}>
      {!isMine && showUserInfo && (
        <TouchableOpacity
          onPress={() => router.push(`/profile?userId=${item?.user?.id}`)}
        >
          <View style={styles.userInfo}>
            <Avatar uri={item?.user?.image || ""} size={wp(10)} />
            <Text>{item?.user?.name}</Text>
          </View>
        </TouchableOpacity>
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
  },
});
