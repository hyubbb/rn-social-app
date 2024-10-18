import React, { useEffect } from "react";
import { Stack, useRouter } from "expo-router";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { getUserData } from "@/service/userService";
import { SupabaseUser } from "@/types";
import { LogBox } from "react-native";

LogBox.ignoreLogs([
  "Warning: TRenderEngineProvider:",
  "Warning: MemoizedTNodeRenderer:",
  "Warning: TNodeChildrenRenderer:",
]);
const _layout = () => {
  return (
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  );
};

const MainLayout = () => {
  const { setAuth, setUserData } = useAuth();
  const router = useRouter();
  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        setAuth(session?.user);
        updateUserData(session?.user);
        router.push("/home");
      } else {
        setAuth(null);
        router.push("/welcome");
      }
    });
  }, []);

  // supabase에서 유저 데이터만 가져오기
  const updateUserData = async (user: SupabaseUser) => {
    let res = await getUserData(user?.id);
    if (res.success) {
      setUserData({ ...res.data, email: user.email });
    }
  };

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
};

export default _layout;
