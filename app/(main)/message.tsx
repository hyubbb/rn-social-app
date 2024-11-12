import {
  FlatList,
  KeyboardAvoidingView,
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
import { MessageTypeWithUser, UserType } from "@/types";
import { getUserData } from "@/service/userService";
import Loading from "@/components/Loading";
import MessageItem from "@/components/MessageItem";
import { hp, wp } from "@/helpers/commons";
import { fetchMessages } from "@/service/MessageService";
import { useSocket } from "@/socket/socket";
import useUserStore from "@/store/userStore";

const Message = () => {
  const { user: currentUser } = useUserStore((state: any) => state);
  const { otherUserId, roomId } = useLocalSearchParams();
  const [otherUser, setOtherUser] = useState<UserType | null>(null);
  const [messageData, setMessageData] = useState<MessageTypeWithUser[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1); // 페이지 상태 추가
  const [hasMore, setHasMore] = useState(true); // 추가 데이터 여부 확인
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  const flatListRef = useRef<FlatList>(null);

  const { socket } = useSocket();

  useEffect(() => {
    if (otherUserId) {
      fetchUserData(otherUserId as string);
    }
    getMessages(1); // 첫 페이지 로드
    // setHasMore(true);
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

  const getMessages = async (pageNumber = 1) => {
    if (loading || isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);
    setLoading(true);

    try {
      let res = await fetchMessages(roomId as string, pageNumber);
      if (res.success) {
        const reversedData = res.data.reverse();

        // 첫 로드가 아닐 경우에만 이전 높이 저장
        if (!isFirstLoad && flatListRef.current) {
          const height = flatListRef.current.getScrollableNode().scrollHeight;
          setContentHeight(height);
        }

        setMessageData((prev) => [...reversedData, ...prev]);
        setHasMore(res.data.length === 20);
        setPage(pageNumber);

        if (isFirstLoad) {
          setIsFirstLoad(false);
        }
      }
    } catch (error) {
      console.error("메시지 로딩 중 에러:", error);
    } finally {
      setLoading(false);
      setIsLoadingMore(false);
    }
  };

  const loadMoreMessages = () => {
    if (!isLoadingMore && hasMore && !isFirstLoad) {
      getMessages(page + 1);
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
  };

  if (!otherUser) return <Loading />;

  // 현재의 메세지의 높이를 기억햇다가 새로운메시지가 추가되었을때 하단에서 기존의 메세지 높이만틈 스크롤을 해주게 처리하면
  // 새로운 데이터가 추가되어도 그자리로 스트롤되는게 아닐까?

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
          onContentSizeChange={(width, height) => {
            if (!isFirstLoad) {
              // 이전 높이와 새로운 높이의 차이만큼만 스크롤
              const heightDiff = height - contentHeight;
              if (heightDiff > 0) {
                flatListRef.current?.scrollToOffset({
                  offset: heightDiff,
                  animated: false,
                });
              }
            }
            setContentHeight(height);
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
          onStartReached={loadMoreMessages} // 스크롤 끝에 도달 시 다음 페이지 로드
          onStartReachedThreshold={0.1} // 스크롤 위치에 따라 페이지 호출 조정
          maintainVisibleContentPosition={{
            minIndexForVisible: 0,
            autoscrollToTopThreshold: 1,
          }}
          onLayout={(event) => {
            // 초기 레이아웃 높이 저장
            setContentHeight(event.nativeEvent.layout.height);
          }}
          scrollEventThrottle={16}
          onMomentumScrollEnd={() => {
            if (isLoadingMore) {
              setIsLoadingMore(false);
            }
          }}
        />

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
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
