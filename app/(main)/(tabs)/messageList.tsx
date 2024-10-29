import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import Header from "@/components/Header";
import Loading from "@/components/Loading";
import { useAuth } from "@/contexts/AuthContext";
import { fetchChatRooms } from "@/service/MessageService";
import { MessageListType } from "@/types";
import { hp } from "@/helpers/commons";
import { useRouter } from "expo-router";
import Avatar from "@/components/Avatar";
import { theme } from "@/constants/themes";
import moment from "moment";

const MessageList = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [messageList, setMessageList] = useState<MessageListType[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    getMessages();
  }, [user]);

  const getMessages = async () => {
    const res = await fetchChatRooms(user?.id as string);
    if (res.success) {
      setMessageList(res.data);
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }
  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <Header title='Messages' showBackButton={false} />

        {messageList.map((item) => (
          <TouchableOpacity
            key={item.room_id}
            style={styles.chatList}
            onPress={() =>
              router.push({
                pathname: "/message",
                params: {
                  otherUserId: item.user_id,
                  roomId: item.room_id,
                },
              })
            }
          >
            <Avatar
              size={hp(6)}
              uri={item?.users?.image || ""}
              rounded={theme.radius.md}
            />
            <View style={styles.userInfoText}>
              <Text style={styles.userName}>{item?.users?.name}</Text>
              {/* <Text style={styles.createdAt}>{createdAt}</Text> */}
            </View>
          </TouchableOpacity>
        ))}

        {messageList.length == 0 && (
          <Text style={styles.noMessages}>No messages</Text>
        )}
      </View>
    </ScreenWrapper>
  );
};

export default MessageList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 15,
  },
  chatList: {
    gap: 10,
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: theme.radius.xxl,
    shadowColor: theme.colors.textLight,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    backgroundColor: "white",
  },

  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  userInfoText: {
    gap: 5,
  },
  userName: {
    fontSize: hp(1.8),
    fontWeight: theme.fonts.semiBold,
    color: theme.colors.text,
  },
  createdAt: {
    fontSize: hp(1.6),
    color: theme.colors.textLight,
  },

  noMessages: {
    flex: 1,
    marginTop: hp(5),
    fontSize: hp(2),
    textAlign: "center",
  },
});
