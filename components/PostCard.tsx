import {
  Alert,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
  PostLike,
  PostWithUser,
  PostWithUserAndComments,
  UserType,
} from "@/types";
import { Router } from "expo-router";
import {
  downloadFile,
  getLocalFilePath,
  getSupabaseFileUrl,
} from "@/service/imageService";
import Avatar from "./Avatar";
import { theme } from "@/constants/themes";
import { hp } from "@/helpers/commons";
import moment from "moment";
import Icon from "@/assets/icons";
import RenderHtml from "react-native-render-html";
import { Image } from "expo-image";
import { ResizeMode, Video } from "expo-av";
import { createPostLike, deletePostLike } from "@/service/postService";
import Loading from "./Loading";

const textStyle = {
  color: theme.colors.textLight,
  fontSize: hp(1.7),
};

const tagStyles = {
  div: textStyle,
  p: textStyle,
  ol: textStyle,
  h1: {
    color: theme.colors.dark,
  },
  h4: {
    color: theme.colors.dark,
  },
};

type PostCardProps = {
  item: PostWithUserAndComments;
  currentUser: UserType;
  router: Router;
  hasShadow?: boolean;
  showMoreIcon?: boolean;
  showDelete?: boolean;
  onDelete?: (postId: string) => void;
  onEdit?: (item: PostWithUserAndComments) => void;
};

const PostCard = ({
  item,
  currentUser,
  router,
  hasShadow,
  showMoreIcon = true,
  showDelete = false,
  onDelete = () => {},
  onEdit = () => {},
}: PostCardProps) => {
  const { width } = useWindowDimensions();
  const [likes, setLikes] = useState<PostLike[]>([]);
  const [loading, setLoading] = useState(false);

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
  }, []);

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
      userId: currentUser.id,
      postId: item?.id as string,
    };
    if (liked) {
      // 좋아요 취소
      let updatedLikes = likes.filter((like) => like.userId !== currentUser.id);
      setLikes([...updatedLikes]);
      let res = await deletePostLike(data);
      if (!res.success) {
        return Alert.alert("알림", "오류가 발생했습니다.");
      }
    } else {
      // 좋아요 추가
      let res = await createPostLike(data);
      setLikes([...likes, res.data]);
      if (!res.success) {
        return Alert.alert("알림", "오류가 발생했습니다.");
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
      content.url = url || ""; // 'undefined'를 방지하기 위해타입 설정
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

  const createdAt = moment(item?.created_at).format("MM/DD hh:mm");
  const liked = likes.filter((like) => like.userId === currentUser.id)[0]
    ? true
    : false;

  return (
    <View style={[styles.container, hasShadow && shadowStyle]}>
      <View style={styles.header}>
        {/* userinfo and posttime */}
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
              name='ellipsis-horizontal'
              size={20}
              color={theme.colors.text}
            />
          </TouchableOpacity>
        )}

        {showDelete && currentUser.id == item?.userId && (
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

      {/* content */}
      <View style={styles.content}>
        <View style={styles.postBody}>
          {item?.body && (
            <RenderHtml contentWidth={width} source={{ html: item?.body }} />
          )}
        </View>
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

      {/* footer - like, comment, share */}
      <View style={styles.footer}>
        <View style={styles.footerItem}>
          <TouchableOpacity onPress={onLike}>
            <Icon
              name={liked ? "heart" : "heart-outline"}
              size={26}
              color={liked ? theme.colors.rose : theme.colors.textLight}
            />
          </TouchableOpacity>
          <Text>{likes?.length}</Text>
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
    </View>
  );
};

export default PostCard;

const styles = StyleSheet.create({
  container: {
    gap: 10,
    marginBottom: 15,
    borderRadius: theme.radius.xxl,
    borderCurve: "continuous",
    padding: 10,
    paddingVertical: 12,
    backgroundColor: "white",
    borderWidth: 0.5,
    borderColor: theme.colors.gray,
    shadowColor: "#000",
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
    gap: 10,
  },
  postBody: {
    gap: 10,
  },
  postMedia: {
    width: "100%",
    height: hp(30),
    borderRadius: theme.radius.lg,
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
