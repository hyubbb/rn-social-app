import { create } from "zustand";
import { SupabaseUser, UserType } from "@/types";

const useUserStore = create((set) => ({
  user: null,
  // setUser: (user: UserType) => set({ user }),
  setAuth: (user: SupabaseUser | null) => set({ user }),
  setUserData: (userData: UserType) => set({ user: userData }),
}));

export default useUserStore;
