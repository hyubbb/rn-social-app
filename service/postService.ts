import { supabase } from "@/lib/supabase";
import { uploadImage } from "./imageService";
import { PostType, PostWithUser, PostWithUserAndComments } from "@/types";

export const createOrUpdatePost = async (post: any) => {
  try {
    // upload image
    if (post.file && typeof post.file === "object") {
      let isImage = post?.file?.type == "image";
      let folderName = isImage ? "postImages" : "postVideos";
      let fileResult = await uploadImage(folderName, post?.file?.uri, isImage);
      if (fileResult.success) post.file = fileResult.data;
      else {
        return fileResult;
      }
    }

    const { data, error } = await supabase
      .from("posts")
      .upsert(post)
      .select()
      .single();
    if (error) {
      throw error;
    }
    return { success: true, msg: "게시글 작성 성공", data };
  } catch (error) {
    console.log("게시글 작성 오류", error);
    return { success: false, msg: "게시글 작성에 실패" };
  }
};

export const fetchPosts = async (
  limit = 10,
  userId?: string
): Promise<{
  success: boolean;
  msg: string;
  data: PostWithUserAndComments[];
}> => {
  try {
    if (userId) {
      const { data, error } = await supabase
        .from("posts")
        .select(
          "*, user:users(id, name, image), postLikes(*), commentCount:comments(count)"
        )
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(limit);
      if (error) {
        throw error;
      }
      return { success: true, msg: "fetchPost 성공", data };
    } else {
      const { data, error } = await supabase
        .from("posts")
        .select(
          "*, user:users(id, name, image), postLikes(*), commentCount:comments(count)"
        )
        .order("created_at", { ascending: false })
        .limit(limit);
      if (error) {
        throw error;
      }
      return { success: true, msg: "fetchPost 성공", data };
    }
  } catch (error) {
    console.log("fetchPost 오류", error);
    return { success: false, msg: "fetchPost 오류", data: [] };
  }
};

export const fetchPostDetails = async (postId: string) => {
  try {
    const { data, error } = await supabase
      .from("posts")
      .select(
        "*, user:users(id, name, image), postLikes(*), comments(*, user:users(id, name, image)), commentCount:comments(count)"
      )
      .eq("id", postId)
      .order("created_at", { ascending: false, foreignTable: "comments" })
      .single();

    if (error) {
      throw error;
    }

    return { success: true, msg: "fetchPostDetails 성공", data };
  } catch (error) {
    console.log("fetchPostDetails 오류", error);
    return { success: false, msg: "fetchPostDetails 오류", data: [] };
  }
};

export const createPostLike = async (postLike: {
  user_id: string;
  post_id: string;
}) => {
  try {
    const { data, error } = await supabase
      .from("postLikes")
      .insert(postLike)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return { success: true, data };
  } catch (error) {
    console.log("createPostLike 오류", error);
    return { success: false, msg: "createPostLike 오류", data: [] };
  }
};

export const createComment = async (comment: {
  user_id: string;
  post_id: string;
  text: string;
}) => {
  console.log("comment", comment);
  try {
    const { data, error } = await supabase
      .from("comments")
      .insert(comment)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return { success: true, data };
  } catch (error) {
    console.log("createComment 오류", error);
    return { success: false, msg: "createComment 오류", data: [] };
  }
};

export const deletePostLike = async ({
  post_id,
  user_id,
}: {
  post_id: string;
  user_id: string;
}) => {
  try {
    const { error } = await supabase
      .from("postLikes")
      .delete()
      .eq("user_id", user_id)
      .eq("post_id", post_id);

    if (error) {
      throw error;
    }

    return { success: true };
  } catch (error) {
    console.log("removePostLike 오류", error);
    return { success: false, msg: "removePostLike 오류", data: [] };
  }
};

export const deleteComment = async ({ commentId }: { commentId: string }) => {
  try {
    const { error } = await supabase
      .from("comments")
      .delete()
      .eq("id", commentId);

    if (error) {
      throw error;
    }

    return { success: true };
  } catch (error) {
    console.log("deleteComment 오류", error);
    return { success: false, msg: "deleteComment 오류", data: [] };
  }
};

export const deletePost = async ({
  postId,
}: {
  postId: string;
}): Promise<{
  success: boolean;
  msg?: string;
  data?: { postId: string };
}> => {
  try {
    const { error } = await supabase.from("posts").delete().eq("id", postId);

    if (error) {
      throw error;
    }

    return { success: true, data: { postId } };
  } catch (error) {
    console.log("deletePost 오류", error);
    return { success: false, msg: "deletePost 오류", data: [] };
  }
};
