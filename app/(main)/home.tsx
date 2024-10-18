import {
  Alert,
  FlatList,
  LogBox,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import { useAuth } from "@/contexts/AuthContext";
import Button from "@/components/Button";
import { hp, wp } from "@/helpers/commons";
import { theme } from "@/constants/themes";
import Icon from "@/assets/icons";
import { useRouter } from "expo-router";
import Avatar from "@/components/Avatar";
import { onLogout } from "@/service/AuthService";
import { PostType, PostWithUser, UserType } from "@/types";
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
const Home = () => {
  const { user, setAuth } = useAuth();
  const userData = user as UserType;
  const router = useRouter();
  const [posts, setPosts] = useState<PostWithUser[]>([]);

  const handlePostEvent = async (payload: any) => {
    // payload 는 realtime 이벤트 발생시 받는 데이터
    if (payload.eventType == "INSERT") {
      // fetchPost할 때, posts&user이니까
      // payload로 받은 post데이터에 user데이터 병합
      let newPost = { ...payload.new };
      let res = await getUserData(newPost.userId);
      newPost.user = res.success ? res.data : {};
      setPosts((prev) => [newPost, ...prev]);
    }
  };

  useEffect(() => {
    // supabase의 realtime을 사용
    // 포스트 생성, 수정, 삭제 이벤트 발생시 실행
    let postChannel = supabase
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

    getPosts();

    return () => {
      supabase.removeChannel(postChannel);
    };
  }, []);

  const getPosts = async () => {
    let res = await fetchPosts();
    if (res.success) {
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
            <Pressable onPress={() => router.push("/notifications")}>
              <Icon
                name='heart-outline'
                size={hp(3.5)}
                color={theme.colors.text}
              />
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
            <PostCard item={item} currentUser={userData} router={router} />
          )}
          ListFooterComponent={
            <View style={{ marginVertical: posts.length == 0 ? 200 : 30 }}>
              <Loading />
            </View>
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
    paddingHorizontal: wp(4),
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
});
