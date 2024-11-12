import { StatusBar, StyleSheet, View } from "react-native";
import React, { useEffect, useState } from "react";
import { hp, wp } from "@/helpers/commons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { theme } from "@/constants/themes";
import { PostWithUserAndComments, UserType } from "@/types";
import { fetchPosts } from "@/service/postService";
import { getUserData } from "@/service/userService";
import usePostStore from "@/store/postStore";
import PostList from "@/components/profile/PostList";
import ScreenWrapper from "@/components/ScreenWrapper";
import useUserStore from "@/store/userStore";

const Profile = () => {
  const { user: currentUser } = useUserStore((state: any) => state);
  const router = useRouter();
  const [hasMore, setHasMore] = useState(true);
  const [posts, setPosts] = useState<PostWithUserAndComments[]>([]);
  const [userData, setUserData] = useState<UserType | null>(null);
  const [limit, setLimit] = useState(15);
  const { userId } = useLocalSearchParams(); // 다른 유저의 정보를 볼때만 존재하는 값
  const [filterType, setFilterType] = useState<"list" | "calendar">("list");
  const setPostStoreData = usePostStore((state: any) => state.setPosts);

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
    if (userData && hasMore) {
      getPosts();
    }
  }, [userData, hasMore]);

  const fetchUserData = async (userId: string) => {
    let res = await getUserData(userId);
    if (res.success) {
      setUserData(res.data);
    }
  };

  const getPosts = async () => {
    if (!hasMore || !userData) return;
    let res = await fetchPosts(limit, userData.id);
    if (res.success) {
      // 기존의 post갯수와 새로불러온 데이터의 갯수가 같으면 더이상의 업데이트가 존재하지 않는다는 것
      if (posts.length == res.data.length || res.data.length < 15) {
        setHasMore(false);
        return;
      }
      setPostStoreData(res.data);
      setPosts(res.data);
      // 다음 페이지를 위해 limit 증가
      setLimit((prev) => prev + 4);
    }
  };

  return (
    <ScreenWrapper bg='white'>
      <StatusBar barStyle='dark-content' />

      <View style={{ flex: 1 }}>
        <PostList
          posts={posts}
          userData={userData as UserType}
          router={router}
          currentUser={currentUser as UserType}
          hasMore={hasMore}
          getPosts={getPosts}
          filterType={filterType}
          setFilterType={(v: "calendar" | "list") => setFilterType(v)}
        />
      </View>
    </ScreenWrapper>
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

  listStyle: {
    gap: 5,
  },

  contentContainer: {},
});
