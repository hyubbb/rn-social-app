import React, { useEffect } from "react";
import { Stack, Tabs, useRouter } from "expo-router";
import { supabase } from "@/lib/supabase";
import { getUserData } from "@/service/userService";
import { SupabaseUser } from "@/types";
import { LogBox } from "react-native";
import { SocketProvider } from "@/socket/socket";
import useUserStore from "@/store/userStore";

LogBox.ignoreLogs([
  "Warning: TRenderEngineProvider:",
  "Warning: MemoizedTNodeRenderer:",
  "Warning: TNodeChildrenRenderer:",
]);
const _layout = () => {
  return (
    <SocketProvider>
      <MainLayout />
    </SocketProvider>
  );
};

const MainLayout = () => {
  const { setAuth, setUserData } = useUserStore((state: any) => state);
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
      setUserData({
        ...res.data,
        email: user.email,
        name: user.user_metadata.name,
      });
    }
  };

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name='(main)/postDetails'
        options={{ presentation: "modal" }}
      />
    </Stack>
  );
};

export default _layout;
