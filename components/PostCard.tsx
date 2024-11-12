import {
  Alert,
  Pressable,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { PostLike, PostWithUserAndComments, UserType } from "@/types";
import { Router } from "expo-router";
import { downloadFile, getSupabaseFileUrl } from "@/service/imageService";
import Avatar from "./Avatar";
import { theme } from "@/constants/themes";
import { hp, wp } from "@/helpers/commons";
import moment from "moment";
import Icon from "@/assets/icons";
import RenderHtml from "react-native-render-html";
import { Image } from "expo-image";
import { ResizeMode, Video } from "expo-av";
import { createPostLike, deletePostLike } from "@/service/postService";
import Loading from "./Loading";
import usePostStore from "@/store/postStore";

type PostCardProps = {
  item: PostWithUserAndComments;
  currentUser: UserType;
  router: Router;
  hasShadow?: boolean;
  showMoreIcon?: boolean;
  showDelete?: boolean;
  onDelete?: (postId: string) => void;
  onEdit?: (item: PostWithUserAndComments) => void;
  listType?: "post" | "profile";
};

const PostCard = ({
  item,
  currentUser,
  router,
  hasShadow = false,
  showMoreIcon = true,
  showDelete = false,
  onDelete = () => {},
  onEdit = () => {},
  listType = "post",
}: PostCardProps) => {
  const { width } = useWindowDimensions();
  const [likes, setLikes] = useState<PostLike[]>([]);
  const [loading, setLoading] = useState(false);
  const { posts, setPosts } = usePostStore((state: any) => state);

  const shadowStyle = {
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 1,
  };

  useEffect(() => {
    if (item?.postLikes) setLikes(item?.postLikes);
  }, [item]);

  const openPostDetails = () => {
    if (!showMoreIcon) return null;

    router.push({
      pathname: "/postDetails",
      params: {
        postId: item?.id,
      },
    });
  };

  const onLike = async () => {
    let data = {
      user_id: currentUser.id,
      post_id: item?.id as string,
    };
    if (liked) {
      // 좋아요 취소
      let updatedLikes = likes.filter(
        (like) => like.user_id !== currentUser.id
      );

      let res = await deletePostLike(data);
      if (!res.success) {
        return Alert.alert("알림", "오류가 발생했습니다.");
      } else {
        setLikes([...updatedLikes]);

        setPosts(
          posts.map((post: PostWithUserAndComments) =>
            post.id == item.id ? { ...post, postLikes: updatedLikes } : post
          )
        );
      }
    } else {
      // 좋아요 추가
      let res = await createPostLike(data);
      if (!res.success) {
        return Alert.alert("알림", "오류가 발생했습니다.");
      } else {
        setLikes([...likes, res.data]);
        // console.log(res.data);

        setPosts(
          posts.map((post: PostWithUserAndComments) =>
            post.id == item.id
              ? { ...post, postLikes: [...likes, res.data] }
              : post
          )
        );
      }
    }
  };

  const onShare = async () => {
    let content: { message: string; url: string } = {
      message: "",
      url: "",
    };
    if (item?.file) {
      setLoading(true);
      let url = await downloadFile(
        getSupabaseFileUrl(item?.file as string).uri
      );
      setLoading(false);
      content.url = url || "";
    }
    Share.share(content);
  };

  const handlePostDelete = () => {
    Alert.alert("삭제", "댓글을 삭제하시겠습니까?", [
      { text: "취소", style: "cancel" },
      {
        text: "삭제",
        style: "destructive",
        onPress: () => onDelete(item.id as string),
      },
    ]);
  };

  const postDetail = (postId: string) => {
    if (listType == "post") return;

    router.push({
      pathname: "/postDetails",
      params: {
        postId,
      },
    });
  };

  const createdAt = moment(item?.created_at).format("MM/DD hh:mm");

  const liked = likes?.filter((like) => like?.user_id === currentUser?.id)[0]
    ? true
    : false;

  return (
    <View
      style={[
        styles.container,
        hasShadow && shadowStyle,
        listType == "profile" && styles.listTypeProfile,
      ]}
    >
      {listType == "post" && (
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <TouchableOpacity
              onPress={() => router.push(`/profile?userId=${item?.user?.id}`)}
            >
              <Avatar
                size={hp(6)}
                uri={item?.user?.image || ""}
                rounded={theme.radius.md}
              />
            </TouchableOpacity>
            <View style={styles.userInfoText}>
              <Text style={styles.userName}>{item?.user?.name}</Text>
              <Text style={styles.createdAt}>{createdAt}</Text>
            </View>
          </View>
          {showMoreIcon && (
            <TouchableOpacity onPress={openPostDetails}>
              <Icon
                name='ellipsis-vertical'
                size={20}
                color={theme.colors.text}
              />
            </TouchableOpacity>
          )}

          {showDelete && currentUser.id == item?.user_id && (
            <View style={styles.actions}>
              <TouchableOpacity onPress={() => onEdit(item)}>
                <Icon
                  name='pencil-outline'
                  size={hp(2.5)}
                  color={theme.colors.text}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={handlePostDelete}>
                <Icon
                  name='trash-outline'
                  size={hp(2.5)}
                  color={theme.colors.rose}
                />
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}

      {/* content */}
      <Pressable onPress={() => postDetail(item.id as string)}>
        <View
          style={[
            styles.content,
            listType == "profile" && styles.listTypeProfileContent,
          ]}
        >
          {listType == "post" && item?.body && (
            <View style={styles.postBody}>
              <RenderHtml contentWidth={width} source={{ html: item?.body }} />
            </View>
          )}

          {listType == "profile" && !item?.file && item?.body && (
            <View style={styles.postBodyProfile}>
              <RenderHtml contentWidth={width} source={{ html: item?.body }} />
            </View>
          )}
          {/* post image */}
          {item?.file && (item?.file as string).includes("postImages") && (
            <Image
              source={getSupabaseFileUrl(item?.file as string)}
              style={styles.postMedia}
              transition={100}
              contentFit='cover'
            />
          )}

          {/* post video */}
          {item?.file && (item?.file as string).includes("postVideos") && (
            <Video
              style={[styles.postMedia, { height: hp(30) }]}
              source={getSupabaseFileUrl(item?.file as string)}
              useNativeControls
              resizeMode={ResizeMode.COVER}
              isLooping
            />
          )}
        </View>
      </Pressable>

      {/* footer - like, comment, share */}
      {listType == "post" && (
        <View style={styles.footer}>
          <View style={styles.footerItem}>
            <TouchableOpacity onPress={onLike}>
              <Icon
                name={liked ? "heart" : "heart-outline"}
                size={26}
                color={liked ? theme.colors.rose : theme.colors.textLight}
              />
            </TouchableOpacity>
            <Text>{likes?.length ?? 0}</Text>
          </View>
          <View style={styles.footerItem}>
            <TouchableOpacity onPress={openPostDetails}>
              <Icon
                name='chatbox-outline'
                size={24}
                color={theme.colors.textLight}
              />
            </TouchableOpacity>
            <Text>{item?.commentCount?.[0]?.count ?? 0}</Text>
          </View>
          <View style={styles.footerItem}>
            {loading ? (
              <Loading size='small' />
            ) : (
              <TouchableOpacity onPress={onShare}>
                <Icon
                  name='share-outline'
                  size={24}
                  color={theme.colors.textLight}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}
    </View>
  );
};

export default PostCard;

const styles = StyleSheet.create({
  container: {
    gap: 10,
    marginBottom: 15,
    borderRadius: theme.radius.md,
    borderCurve: "continuous",
    padding: 10,
    paddingVertical: 12,
    backgroundColor: "white",
    borderWidth: 0.5,
    borderColor: theme.colors.darkLight,
  },
  listTypeProfile: {
    padding: 0,
    paddingVertical: 0,
    margin: 0,
    width: `${100 / 3.2}%`,
    overflow: "hidden",
    flexDirection: "row",
    borderWidth: 1,
  },
  listTypeProfileContent: {
    width: `${100}%`,
    aspectRatio: 1,
    gap: 0,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
  content: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  postBody: {
    flexDirection: "row",
    gap: 10,
    padding: 5,
  },

  postBodyProfile: {
    flex: 1,
    fontSize: hp(1.8),
    justifyContent: "center",
    gap: 10,
    alignItems: "center",
    padding: 5,
  },
  postMedia: {
    width: "100%",
    height: hp(30),
    aspectRatio: 1,
    borderRadius: theme.radius.md,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    gap: 13,
  },
  footerItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  actions: {
    flexDirection: "row",
    gap: 10,
  },
});
