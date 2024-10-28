import {
  Alert,
  FlatList,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import { onLogout } from "@/service/AuthService";
import { hp, wp } from "@/helpers/commons";
import { useAuth } from "@/contexts/AuthContext";
import { useLocalSearchParams, useRouter } from "expo-router";
import Header from "@/components/Header";
import { theme } from "@/constants/themes";
import Icon from "@/assets/icons";
import Avatar from "@/components/Avatar";
import { PostWithUserAndComments, UserType } from "@/types";
import { fetchPosts } from "@/service/postService";
import PostCard from "@/components/PostCard";
import Loading from "@/components/Loading";
import { getUserData } from "@/service/userService";
import { createChatRoom, fetchChat } from "@/service/MessageService";

type UserHeaderProps = {
  user: UserType;
  router: any;
  handleLogout: () => void;
  currentUser: string | undefined;
  firstChat: () => Promise<void>;
};

var limit = 0;
const Profile = () => {
  const { user: currentUser } = useAuth();
  const router = useRouter();
  const [hasMore, setHasMore] = useState(true);
  const [posts, setPosts] = useState<PostWithUserAndComments[]>([]);
  const [userData, setUserData] = useState<UserType | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { userId } = useLocalSearchParams(); // 다른 유저의 정보를 볼때만 존재하는 값

  useEffect(() => {
    if (userId) {
      // 타인의 정보를 확인
      fetchUserData(userId as string);
    } else {
      // 나의 데이터를 확인
      setUserData(currentUser as UserType);
    }
  }, [userId, currentUser]);

  useEffect(() => {
    getPosts();
  }, [userData]);

  const fetchUserData = async (userId: string) => {
    let res = await getUserData(userId);
    if (res.success) {
      setUserData(res.data);
    }
  };

  const handleLogout = () => {
    Alert.alert("로그아웃", "정말 로그아웃 하시겠습니까?", [
      {
        text: "취소",
        onPress: () => console.log("modal cancelled"),
        style: "cancel",
      },
      {
        text: "로그아웃",
        onPress: () => onLogout(),
        style: "destructive",
      },
    ]);
  };

  const getPosts = async () => {
    if (!hasMore || !userData) return;
    limit = limit + 4;
    let res = await fetchPosts(limit, userData.id);
    if (res.success) {
      // 기존의 post갯수와 새로불러온 데이터의 갯수가 같으면 더이상의 업데이트가 존재하지 않는다는 것
      if (posts.length == res.data.length) {
        setHasMore(false);
      }
      setPosts(res.data);
    }
  };

  const firstChat = async () => {
    setIsLoading(true);
    // 채팅이 없으면 첫메시지라는것인데
    // 그럼 채팅방이 존재하지 않기때문에 채팅방을 만들어주는 코드작성
    let data = {
      userId: currentUser?.id as string,
      otherUserId: userData?.id as string,
    };

    // profile에서 눌렀을때, 방의정보를 가져왔는데 없을때는 create, 아니면 router
    let res = await fetchChat(data);
    if (res.success) {
      if (res.data.length == 0) {
        // 채팅방이 없으면 채팅방을 만들어줌
        let res = await createChatRoom(data);
        if (res.success) {
          router.push({
            pathname: "/message",
            params: {
              otherUserId: userData?.id,
              roomId: res.data.id,
            },
          });
        }
      } else {
        router.push({
          pathname: "/message",
          params: {
            otherUserId: userData?.id,
            roomId: res.data[0].room_id,
          },
        });
      }
      setIsLoading(false);
    }
  };

  if (!userData || isLoading) {
    return <Loading />;
  }

  return (
    <ScreenWrapper bg={"white"}>
      <StatusBar barStyle='dark-content' />

      <FlatList
        data={posts}
        ListHeaderComponent={
          <UserHeader
            user={userData}
            router={router}
            handleLogout={handleLogout}
            currentUser={currentUser?.id}
            firstChat={firstChat}
          />
        }
        ListHeaderComponentStyle={{ marginBottom: 30 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listStyle}
        keyExtractor={(item) => item.id + ""}
        renderItem={({ item }) => (
          <PostCard item={item} currentUser={userData} router={router} />
        )}
        onEndReached={() => {
          // 최하단에 도달시
          getPosts();
        }}
        onEndReachedThreshold={0} // 최하단에 도달 범위
        ListFooterComponent={
          hasMore ? (
            <View style={{ marginVertical: posts.length == 0 ? 200 : 30 }}>
              <Loading />
            </View>
          ) : (
            <View style={{ marginVertical: 30, marginTop: 10 }}>
              <Text style={styles.noMore}>더 이상 게시글이 없습니다.</Text>
            </View>
          )
        }
      />
    </ScreenWrapper>
  );
};

const UserHeader = ({
  user,
  router,
  handleLogout,
  currentUser,
  firstChat,
}: UserHeaderProps) => {
  return (
    <View style={styles.header}>
      <View>
        <Header title='Profile' mb={20} />
        <Pressable style={styles.logoutButton} onPress={handleLogout}>
          <Icon name='power-outline' size={25} color={theme.colors.rose} />
        </Pressable>
      </View>
      <View style={styles.container}>
        <View style={styles.avatarContainer}>
          <Avatar
            uri={user?.image || ""}
            size={hp(12)}
            rounded={theme.radius.xxl * 1.4}
          />
          {user?.id == currentUser ? (
            // 내 프로필일 경우
            <Pressable
              style={styles.editIcon}
              onPress={() => router.push("/editProfile")}
            >
              <Icon
                name='create-outline'
                size={20}
                color={theme.colors.textDark}
              />
            </Pressable>
          ) : (
            // 타인의 프로필일 경우
            <Pressable style={styles.editIcon} onPress={() => firstChat()}>
              <Icon
                name='chatbubble-outline'
                size={20}
                color={theme.colors.textDark}
              />
            </Pressable>
          )}
        </View>
        {/* useName and address */}
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{user?.name}</Text>
          {/* <Text style={styles.userAddress}>{user?.address}</Text> */}
        </View>
        {/* email, phone, bio */}
        <View style={styles.info}>
          <View style={styles.infoItem}>
            <Icon
              name='mail-outline'
              size={20}
              color={theme.colors.textLight}
            />
            <Text style={styles.infoText}>{user?.email}</Text>
          </View>

          {user?.phoneNumber && (
            <View style={styles.infoItem}>
              <Icon
                name='call-outline'
                size={20}
                color={theme.colors.textLight}
              />
              <Text style={styles.infoText}>{user?.phoneNumber}</Text>
            </View>
          )}

          {user?.bio && <Text style={styles.infoText}>{user?.bio}</Text>}
        </View>
      </View>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  header: {
    flex: 1,
  },
  container: {
    flex: 1,
    gap: 20,
  },
  logoutButton: {
    position: "absolute",
    right: 0,
    top: 0,
    backgroundColor: "#ffe8e8",
    padding: 5,
    borderRadius: theme.radius.sm,
  },
  avatarContainer: {
    height: hp(12),
    alignItems: "center",
  },
  editIcon: {
    position: "absolute",
    width: wp(8),
    height: hp(4),
    justifyContent: "center",
    alignItems: "center",
    right: wp(32),
    bottom: 0,
    backgroundColor: "white",
    padding: 4,
    borderRadius: theme.radius.xxl,
    shadowColor: theme.colors.textLight,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 1,
    elevation: 7,
  },
  userInfo: {
    gap: 4,
    alignItems: "center",
  },
  userName: {
    fontSize: hp(3),
    color: theme.colors.text,
    fontWeight: theme.fonts.medium,
  },
  userAddress: {
    fontSize: hp(1.5),
    color: theme.colors.textLight,
  },
  info: {
    gap: 15,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    height: hp(3),
    gap: 10,
  },
  infoText: {
    fontSize: hp(2),
    color: theme.colors.textLight,
  },
  listStyle: {},
  noMore: {
    fontSize: hp(2),
    textAlign: "center",
    color: theme.colors.text,
  },
});
