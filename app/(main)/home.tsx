import {
  Alert,
  FlatList,
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
import { PostType, UserType } from "@/types";
import { getPosts } from "@/service/postService";
import PostCard from "@/components/PostCard";

const Home = () => {
  const { user, setAuth } = useAuth();
  const userData = user as UserType;
  const router = useRouter();
  const [posts, setPosts] = useState<PostType[]>([]);
  useEffect(() => {
    const fetchPosts = async () => {
      const posts = await getPosts();
      setPosts(posts);
    };
    fetchPosts();
  }, []);

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
        <ScrollView>
          <FlatList
            data={posts}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listStyle}
            keyExtractor={(item) => item.id + ""}
            renderItem={({ item }) => (
              <PostCard item={item} currentUser={userData} router={router} />
            )}
          />
        </ScrollView>
      </View>
      <Button
        title='logout'
        onPress={onLogout}
        buttonStyle={{ marginBottom: 20, marginHorizontal: wp(4) }}
      />
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
    marginBottom: 10,
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
