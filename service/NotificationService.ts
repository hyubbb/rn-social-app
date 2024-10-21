import { supabase } from "@/lib/supabase";

export const createNotification = async (notification: {
  senderId: string;
  receiverId: string;
  title: string;
  data: string;
}) => {
  try {
    const { data, error } = await supabase
      .from("notifications")
      .insert(notification)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return { success: true, data };
  } catch (error) {
    console.log("createNotification 오류", error);
    return { success: false, msg: "createNotification 오류", data: [] };
  }
};

export const fetchNotifications = async (receiverId: string) => {
  try {
    const { data, error } = await supabase
      .from("notifications")
      .select(`*, sender:senderId(id, name, image)`)
      .eq("receiverId", receiverId)
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return { success: true, msg: "fetchNotifications 성공", data };
  } catch (error) {
    console.log("fetchNotifications 오류", error);
    return { success: false, msg: "fetchNotifications 오류", data: [] };
  }
};
