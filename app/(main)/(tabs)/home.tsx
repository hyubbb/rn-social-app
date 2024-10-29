import {
  Alert,
  FlatList,
  LogBox,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import { useAuth } from "@/contexts/AuthContext";
import { hp } from "@/helpers/commons";
import { theme } from "@/constants/themes";
import Icon from "@/assets/icons";
import { useRouter } from "expo-router";
import Avatar from "@/components/Avatar";
import { PostWithUserAndComments, UserType } from "@/types";
import { fetchPosts } from "@/service/postService";
import PostCard from "@/components/PostCard";
import Loading from "@/components/Loading";
import { supabase } from "@/lib/supabase";
import { getUserData } from "@/service/userService";

LogBox.ignoreLogs([
  "Warning: TRenderEngineProvider:",
  "Warning: MemoizedTNodeRenderer:",
  "Warning: TNodeChildrenRenderer:",
]);
var limit = 0;
const Home = () => {
  const { user, setAuth } = useAuth();
  const userData = user as UserType;
  const router = useRouter();
  const [posts, setPosts] = useState<PostWithUserAndComments[]>([]);
  const [notifications, setNotifications] = useState<number>(0);
  const [hasMore, setHasMore] = useState(true);

  // let limit = 0;
  const handlePostEvent = async (payload: any) => {
    // payload 는 realtime 이벤트 발생시 받는 데이터
    if (payload.eventType == "INSERT" && payload?.new?.id) {
      // fetchPost할 때, posts&user이니까
      // payload로 받은 post데이터에 user데이터 병합
      let newPost = { ...payload.new };
      let res = await getUserData(newPost.userId);
      newPost.user = res.success ? res.data : {};
      setPosts((prev) => [newPost, ...prev]);
    }
    if (payload.eventType == "DELETE" && payload?.old?.id) {
      setPosts((prev) => prev.filter((post) => post.id !== payload.old.id));
    }

    if (payload.eventType == "UPDATE" && payload?.new?.id) {
      setPosts((prev) =>
        prev.map((post) =>
          post.id == payload.new.id ? { ...post, ...payload.new } : post
        )
      );
    }
  };

  const handleNotificationEvent = async (payload: any) => {
    if (payload.eventType == "INSERT" && payload?.new?.id) {
      setNotifications((prev) => prev + 1);
    }
  };

  useEffect(() => {
    // supabase의 realtime을 사용
    // 포스트 생성, 수정, 삭제 이벤트 발생시 실행
    let dispatchChannel = supabase
      .channel("posts")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "posts",
        },
        handlePostEvent
      )
      .subscribe();

    // getPosts();

    let notificationChannel = supabase
      .channel("notifications")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "notifications",
          filter: `receiverId=eq.${userData?.id}`,
        },
        handleNotificationEvent
      )
      .subscribe();

    return () => {
      supabase.removeChannel(dispatchChannel);
      supabase.removeChannel(notificationChannel);
    };
  }, []);

  const getPosts = async () => {
    if (!hasMore) return;
    limit = limit + 4;

    let res = await fetchPosts(limit);
    if (res.success) {
      // 기존의 post갯수와 새로불러온 데이터의 갯수가 같으면 더이상의 업데이트가 존재하지 않는다는 것
      if (posts.length == res.data.length) {
        setHasMore(false);
      }
      setPosts(res.data);
    }
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        {/* header */}
        <View style={styles.header}>
          <Text style={styles.title}>SNS</Text>
          <View style={styles.icons}>
            <Pressable
              onPress={() => {
                setNotifications(0);
                router.push("/notifications");
              }}
            >
              <Icon
                name='heart-outline'
                size={hp(3.5)}
                color={theme.colors.text}
              />
              {notifications > 0 && (
                <View style={styles.notification}>
                  <Text style={styles.notificationText}>{notifications}</Text>
                </View>
              )}
            </Pressable>
            <Pressable onPress={() => router.push("/newPost")}>
              <Icon
                name='add-circle-outline'
                size={hp(3.5)}
                color={theme.colors.text}
              />
            </Pressable>
            <Pressable onPress={() => router.push("/profile")}>
              <Avatar
                uri={userData?.image || ""}
                size={hp(3.5)}
                rounded={theme.radius.sm}
                style={{ borderWidth: 1 }}
              />
            </Pressable>
          </View>
        </View>

        {/* posts */}
        <FlatList
          data={posts}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listStyle}
          keyExtractor={(item) => item.id + ""}
          renderItem={({ item }) => (
            <PostCard
              item={item}
              currentUser={userData}
              router={router}
              hasShadow={true}
            />
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
      </View>
    </ScreenWrapper>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: hp(3),
    color: theme.colors.text,
    fontWeight: theme.fonts.bold,
  },
  icons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 13,
  },
  listStyle: {},
  noMore: {
    fontSize: hp(2),
    textAlign: "center",
    color: theme.colors.text,
  },
  notification: {
    position: "absolute",
    top: -3,
    right: -5,
    width: hp(2),
    height: hp(2),
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.rose,
    borderRadius: 20,
  },
  notificationText: {
    fontSize: hp(1.5),
    color: "white",
  },
});
