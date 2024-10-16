import { supabase } from "@/lib/supabase";
import { Alert } from "react-native";

export const onLogout = async () => {
  // setAuth(null);
  const { error } = await supabase.auth.signOut();
  if (error) {
    Alert.alert("Logout", error.message);
  }
};
