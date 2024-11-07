import {
  FlatList,
  KeyboardAvoidingView,
  KeyboardAvoidingViewComponent,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import { useLocalSearchParams } from "expo-router";
import Input from "@/components/Input";
import Icon from "@/assets/icons";
import { theme } from "@/constants/themes";
import Header from "@/components/Header";
import { MessageType, MessageTypeWithUser, UserType } from "@/types";
import { getUserData } from "@/service/userService";
import Loading from "@/components/Loading";
import { ScrollView } from "react-native";
import MessageItem from "@/components/MessageItem";
import { hp, wp } from "@/helpers/commons";
import {
  createChatRoom,
  fetchMessages,
  sendMessage,
} from "@/service/MessageService";
import { useAuth } from "@/contexts/AuthContext";
import { useSocket } from "@/socket/socket";

const Message = () => {
  const { user: currentUser } = useAuth();
  const { otherUserId, roomId } = useLocalSearchParams(); // 다른 유저의 정보를 볼때만 존재하는 값
  const [otherUser, setOtherUser] = useState<UserType | null>(null);
  const [messageData, setMessageData] = useState<MessageTypeWithUser[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const { socket } = useSocket();

  useEffect(() => {
    if (otherUserId) {
      fetchUserData(otherUserId as string);
    }
    getMessages();
  }, []);

  useEffect(() => {
    if (!socket || !roomId) return;
    socket?.emit("joinRoom", roomId);
    socket?.on("message", (data) => {
      setMessageData((prev) => [...prev, data]);
    });
  }, [socket, roomId]);

  const fetchUserData = async (userId: string) => {
    let res = await getUserData(userId);
    if (res.success) {
      setOtherUser(res.data);
    }
  };

  const getMessages = async () => {
    let res = await fetchMessages(roomId as string);
    if (res.success) {
      setMessageData(res.data);
    }
  };

  const onSendMessage = async () => {
    if (!message.trim()) return;

    socket?.emit("sendMessage", {
      userId: currentUser?.id,
      roomId: roomId,
      content: message,
    });

    setMessage("");

    // let res = await sendMessage({
    //   userId: currentUser?.id as string,
    //   roomId: roomId as string,
    //   message,
    // });
    // if (res.success) {
    // setMessage("");
    // }
  };

  if (!otherUser) return <Loading />;

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <Header title={otherUser.name} />

        <FlatList
          data={messageData}
          ref={flatListRef}
          renderItem={({ item, index }) => (
            <MessageItem
              item={item}
              prevItem={index > 0 ? messageData[index - 1] : null}
            />
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messageContents}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Text>{otherUser.name}님에게</Text>
              <Text>메시지를 보내보세요.</Text>
            </View>
          )}
          onContentSizeChange={() => {
            if (messageData && messageData.length > 0) {
              flatListRef.current?.scrollToIndex({
                index: messageData.length - 1,
              });
            }
          }}
          onScrollToIndexFailed={() => {
            if (messageData && messageData.length > 0) {
              const wait = new Promise((resolve) => setTimeout(resolve, 300));
              wait.then(() => {
                flatListRef.current?.scrollToIndex({
                  index: messageData.length - 1,
                });
              });
            }
          }}
        />

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"} // iOS와 Android의 동작 차이를 고려
          keyboardVerticalOffset={hp(5)}
        >
          <View style={styles.inputContainer}>
            <Input
              value={message}
              onChangeText={setMessage}
              containerStyles={{
                flex: 1,
                height: hp(6),
              }}
              placeholder='메시지를 입력하세요.'
              style={styles.input}
            />
            {loading ? (
              <View style={styles.loading}>
                <Loading size='small' />
              </View>
            ) : (
              <TouchableOpacity style={styles.sendIcon} onPress={onSendMessage}>
                <Icon
                  name='paper-plane-outline'
                  size={20}
                  color={theme.colors.primaryDark}
                />
              </TouchableOpacity>
            )}
          </View>
        </KeyboardAvoidingView>
      </View>
    </ScreenWrapper>
  );
};

export default Message;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 10,
  },
  messageContents: {
    gap: 10,
    flexGrow: 1,
    justifyContent: "flex-end",
    padding: 10,
    backgroundColor: theme.colors.darkLight,
  },
  inputContainer: {
    marginBottom: 20,
    flexDirection: "row",
    gap: 7,
  },
  input: { flex: 1 },
  sendIcon: {
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    width: wp(12),
    borderWidth: 0.7,
    borderColor: theme.colors.primary,
    borderRadius: theme.radius.lg,
    borderCurve: "continuous",
  },
  loading: {
    padding: 10,
    height: hp(7),
    width: wp(12),
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
});
