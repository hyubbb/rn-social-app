import { PostWithUserAndComments } from "@/types";
import { create } from "zustand";

const usePostStore = create((set) => ({
  posts: [],
  setPosts: (postsData: PostWithUserAndComments[]) => set({ posts: postsData }),
}));

export default usePostStore;
