import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import Avatar from "./Avatar";
import { hp } from "@/helpers/commons";
import { theme } from "@/constants/themes";
import moment from "moment";

const NotificationItem = ({ item, router }: { item: any; router: any }) => {
  const { postId, commentId } = JSON.parse(item.data);
  const handleClick = () => {
    router.push({ pathname: "/postDetails", params: { postId, commentId } });
  };

  const createAt = moment(item.created_at).format("MMM D");
  return (
    <TouchableOpacity onPress={handleClick}>
      <View style={styles.container}>
        <Avatar
          uri={item.sender.image}
          size={hp(5)}
          rounded={theme.radius.sm}
        />
        <View style={styles.notificationInfo}>
          <Text>{item?.sender.name}</Text>
          <Text>{item?.title}</Text>
        </View>
        <Text>{createAt}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default NotificationItem;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    padding: 15,
    borderWidth: 0.5,
    borderColor: theme.colors.darkLight,
    borderRadius: theme.radius.sm,
    borderCurve: "continuous",
  },
  notificationInfo: {
    flex: 1,
    gap: 5,
    justifyContent: "center",
  },
});
