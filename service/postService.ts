import { supabase } from "@/lib/supabase";
import { uploadImage } from "./imageService";
import { PostType, PostWithUser } from "@/types";

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
  limit = 10
): Promise<{
  success: boolean;
  msg: string;
  data: PostWithUser[];
}> => {
  try {
    const { data, error } = await supabase
      .from("posts")
      .select("*, user:users(id, name, image), postLikes(*)")
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error) {
      throw error;
    }

    return { success: true, msg: "fetchPosts 성공", data };
  } catch (error) {
    console.log("fetchPost 오류", error);
    return { success: false, msg: "fetchPost 오류", data: [] };
  }
};

export const createPostLike = async (postLike: {
  userId: string;
  postId: string;
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

export const deletePostLike = async ({
  postId,
  userId,
}: {
  postId: string;
  userId: string;
}) => {
  try {
    const { error } = await supabase
      .from("postLikes")
      .delete()
      .eq("userId", userId)
      .eq("postId", postId);

    if (error) {
      throw error;
    }

    return { success: true };
  } catch (error) {
    console.log("removePostLike 오류", error);
    return { success: false, msg: "removePostLike 오류", data: [] };
  }
};
