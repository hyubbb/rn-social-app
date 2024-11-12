import { FlatList, StyleSheet, Text, View } from "react-native";
import React from "react";
import PostCard from "../PostCard";
import Loading from "../Loading";
import { PostWithUserAndComments, UserType } from "@/types";
import { hp } from "@/helpers/commons";
import { theme } from "@/constants/themes";
import ProfileHeader from "./ProfileHeader";
import Calendar from "@/app/(main)/calendar";

type PostListProps = {
  posts: PostWithUserAndComments[];
  userData: UserType;
  router: any;
  currentUser: UserType;
  hasMore: boolean;
  getPosts: () => void;
  filterType: "calendar" | "list";
  setFilterType: (filterType: "calendar" | "list") => void;
};

const PostList = ({
  posts,
  userData,
  router,
  currentUser,
  getPosts,
  hasMore,
  filterType,
  setFilterType,
}: PostListProps) => {
  return (
    <FlatList
      data={posts}
      ListHeaderComponent={
        <ProfileHeader
          user={userData}
          router={router}
          currentUser={currentUser?.id}
          posts={posts}
          setFilterType={(v: "calendar" | "list") => setFilterType(v)}
        />
      }
      ListHeaderComponentStyle={{ marginBottom: 10 }}
      numColumns={3}
      columnWrapperStyle={{
        gap: 10,
      }}
      showsVerticalScrollIndicator={false}
      keyExtractor={(item) => item.id + ""}
      renderItem={({ item }) =>
        filterType == "list" ? (
          <PostCard
            item={item}
            currentUser={userData}
            router={router}
            listType='profile'
          />
        ) : null
      }
      onEndReached={() => {
        // 최하단에 도달시
        getPosts();
      }}
      onEndReachedThreshold={0.5} // 최하단에 도달 범위
      ListFooterComponent={
        filterType == "list" ? (
          hasMore ? (
            <View style={{ marginVertical: posts.length == 0 ? 50 : 30 }}>
              <Loading size='small' />
            </View>
          ) : (
            <View style={{ marginVertical: 30, marginTop: 10 }}>
              <Text style={styles.noMore}>더 이상 게시글이 없습니다.</Text>
            </View>
          )
        ) : (
          <Calendar posts={posts} userId={userData.id} />
        )
      }
    />
  );
};

export default PostList;

const styles = StyleSheet.create({
  noMore: {
    fontSize: hp(2),
    textAlign: "center",
    color: theme.colors.text,
  },
});
