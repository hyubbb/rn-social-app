import { supabase } from "@/lib/supabase";
import { UserType } from "@/types";

export const getUserData = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) throw error;

    return { success: true, data };
  } catch (error: any) {
    console.log("error : ", error);
    return { success: false, msg: error.message };
  }
};

export const updateUserData = async (
  userId: string,
  data: Partial<UserType>
) => {
  try {
    const { error } = await supabase
      .from("users")
      .update(data)
      .eq("id", userId);

    if (error) throw error;

    return { success: true, data };
  } catch (error: any) {
    console.log("error : ", error);
    return { success: false, msg: error.message };
  }
};
