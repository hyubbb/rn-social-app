import {
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import React from "react";
import { PostWithUser, UserType } from "@/types";
import { Router } from "expo-router";
import { getSupabaseFileUrl } from "@/service/imageService";
import Avatar from "./Avatar";
import { theme } from "@/constants/themes";
import { hp } from "@/helpers/commons";
import moment from "moment";
import Icon from "@/assets/icons";
import RenderHtml from "react-native-render-html";
import { Image } from "expo-image";
import { ResizeMode, Video } from "expo-av";

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

const PostCard = ({
  item,
  currentUser,
  router,
  hasShadow = true,
}: {
  item: PostWithUser;
  currentUser: UserType;
  router: Router;
  hasShadow?: boolean;
}) => {
  const { width } = useWindowDimensions();
  const shadowStyle = {
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 1,
  };

  const liked = true;

  const postTime = moment(item?.created_at).format("MM/DD hh:mm");
  return (
    <View style={[styles.container, hasShadow && shadowStyle]}>
      <View style={styles.header}>
        {/* userinfo and posttime */}
        <View style={styles.userInfo}>
          <Avatar
            size={hp(6)}
            uri={item?.user?.image || ""}
            rounded={theme.radius.md}
          />
          <View style={styles.userInfoText}>
            <Text style={styles.userName}>{item?.user?.name}</Text>
            <Text style={styles.postTime}>{postTime}</Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => {}}>
          <Icon
            name='ellipsis-horizontal'
            size={20}
            color={theme.colors.text}
          />
        </TouchableOpacity>
      </View>
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
          <TouchableOpacity>
            <Icon
              name={liked ? "heart" : "heart-outline"}
              size={26}
              color={liked ? theme.colors.rose : theme.colors.textLight}
            />
          </TouchableOpacity>
          <Text>{item?.likes_count || 0}</Text>
        </View>
        <View style={styles.footerItem}>
          <TouchableOpacity>
            <Icon
              name='chatbox-outline'
              size={24}
              color={theme.colors.textLight}
            />
          </TouchableOpacity>
          <Text>{item?.comments_count || 0}</Text>
        </View>
        <View style={styles.footerItem}>
          <TouchableOpacity onPress={() => {}}>
            <Icon
              name='share-outline'
              size={24}
              color={theme.colors.textLight}
            />
          </TouchableOpacity>
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
  postTime: {
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
});
