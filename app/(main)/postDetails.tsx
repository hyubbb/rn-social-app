import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  createComment,
  deleteComment,
  deletePost,
  fetchPostDetails,
} from "@/service/postService";
import PostCard from "@/components/PostCard";
import { CommentType, PostWithUserAndComments, UserType } from "@/types";
import Loading from "@/components/Loading";
import Input from "@/components/Input";
import { theme } from "@/constants/themes";
import { hp, wp } from "@/helpers/commons";
import Icon from "@/assets/icons";
import CommentItem from "@/components/CommentItem";
import { supabase } from "@/lib/supabase";
import { getUserData } from "@/service/userService";
import { createNotification } from "@/service/NotificationService";
import useUserStore from "@/store/userStore";
import usePostStore from "@/store/postStore";

const PostDetails = () => {
  const router = useRouter();
  const { postId, commentId } = useLocalSearchParams();
  const { user } = useUserStore((state: any) => state);
  const { posts, setPosts } = usePostStore((state: any) => state);

  const [startLoading, setStartLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [post, setPost] = useState<PostWithUserAndComments | null>(null);

  const inputRef = useRef<TextInput>(null);
  const commentRef = useRef("");

  const handleCommentEvent = async (payload: any) => {
    // payload 는 realtime 이벤트 발생시 받는 데이터
    if (payload.new) {
      let newComment = { ...payload.new };
      let res = await getUserData(newComment.user_id);
      newComment.user = res.success ? res.data : {};
      setPost((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          comments: [...prev.comments, newComment],
        };
      });
    }
  };

  useEffect(() => {
    let dispathCommentEvent = supabase
      .channel("comments")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "comments",
          filter: `post_id=eq.${postId}`,
        },
        handleCommentEvent
      )
      .subscribe();
    getPostDetails(postId as string);
    setStartLoading(false);

    return () => {
      supabase.removeChannel(dispathCommentEvent);
    };
  }, []);

  const getPostDetails = async (postId: string) => {
    const res = await fetchPostDetails(postId);
    if (res.success) {
      setPost(res.data);
    }
  };

  const onNewComment = async () => {
    if (!commentRef.current) return null;
    let data = {
      user_id: user?.id as string,
      post_id: post?.id as string,
      text: commentRef.current,
    };
    setLoading(true);
    const res = await createComment(data);
    if (res.success) {
      if (user?.id != post?.user_id) {
        let notify = {
          senderId: user?.id as string,
          receiverId: post?.user_id as string,
          title: "새로운 댓글이 달렸습니다.",
          data: JSON.stringify({ postId: post?.id, commentId: res.data.id }),
        };

        createNotification(notify);
      }

      setPosts(
        posts.map((post: PostWithUserAndComments) =>
          post.id == postId
            ? {
                ...post,
                commentCount: [{ count: post.commentCount[0].count + 1 }],
              }
            : post
        )
      );

      setPost((prev) => {
        let updatedPost = { ...prev } as PostWithUserAndComments;
        // updatedPost.comments = [...(updatedPost.comments || []), res.data];
        updatedPost.commentCount[0].count =
          updatedPost.commentCount[0].count + 1;
        return updatedPost;
      });

      setLoading(false);
      // 새로운 댓글을 comments 리스트에 추가

      inputRef.current?.clear();
      commentRef.current = "";
    } else {
      Alert.alert("Comment", res.msg);
    }
  };

  const onDeleteComment = async (commentId: string) => {
    const res = await deleteComment({ commentId });
    if (res.success) {
      setPost((prev) => {
        let updatePost = { ...prev } as PostWithUserAndComments;
        updatePost.comments = updatePost.comments?.filter(
          (comment) => comment.id !== commentId
        );
        setPosts(updatePost);
        return updatePost;
      });
    }
  };

  const onDeletePost = async (postId: string) => {
    // delete post
    let { data, success, msg } = await deletePost({ postId });

    if (success) {
      router.back();
    } else {
      Alert.alert("삭제", msg);
    }
  };

  const onEditPost = async (item: PostWithUserAndComments) => {
    // router의 params은 직렬화 가능한 타입만 허용하기 때문에 직렬화 처리
    const serializedItem = encodeURIComponent(JSON.stringify(item)); // JSON 직렬화 후 URI로 인코딩

    router.back();
    router.push({ pathname: "/newPost", params: { data: serializedItem } });
  };

  if (startLoading) {
    return (
      <View style={styles.center}>
        <Loading />
      </View>
    );
  }

  if (!post) {
    return (
      <View style={styles.center}>
        <Text>게시물을 찾을 수 없습니다.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
      >
        {post && (
          <PostCard
            item={post}
            currentUser={user as UserType}
            router={router}
            hasShadow={false}
            showMoreIcon={false}
            showDelete={true}
            onDelete={onDeletePost}
            onEdit={onEditPost}
          />
        )}

        <View style={styles.inputContainer}>
          <Input
            ref={inputRef}
            placeholder='댓글을 입력해주세요.'
            onChangeText={(text: string) => (commentRef.current = text)}
            placeholderTextColor={theme.colors.textLight}
            containerStyles={{
              flex: 1,
              height: hp(6),
              borderRadius: theme.radius.xl,
            }}
            style={{
              flex: 1,
            }}
            onSubmitEditing={onNewComment}
          />
          {loading ? (
            <View style={styles.loading}>
              <Loading size='small' />
            </View>
          ) : (
            <TouchableOpacity style={styles.sendIcon} onPress={onNewComment}>
              <Icon
                name='paper-plane-outline'
                size={20}
                color={theme.colors.primaryDark}
              />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.commentList}>
          {post?.comments?.map((comment: CommentType) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              highlight={commentId == comment.id}
              canDelete={
                comment.user_id === user?.id || post?.user_id === user?.id
              }
              onDelete={onDeleteComment}
            />
          ))}
          {post?.comments?.length === 0 && (
            <Text style={styles.noComment}>첫 번째 댓글이 되어 보세요 !</Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default PostDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingVertical: wp(7),
  },
  list: {
    paddingHorizontal: wp(4),
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  sendIcon: {
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    height: hp(7),
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
  commentList: {
    gap: 13,
    marginTop: 20,
  },
  noComment: {
    fontSize: hp(1.8),
    flex: 1,
    gap: 5,
    alignItems: "center",
    textAlign: "center",
  },
});
