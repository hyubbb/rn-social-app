import { PostWithUserAndComments } from "@/types";
import { create } from "zustand";

const usePostStore = create((set) => ({
  posts: [],
  setPosts: (posts: PostWithUserAndComments[]) => set({ posts }),
}));

export default usePostStore;
