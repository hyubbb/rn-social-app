import { supabase } from "../lib/supabase";

export const sendMessage = async ({ userId, roomId, message }) => {
  try {
    const { data, error } = await supabase.from("messages").insert({
      user_id: userId,
      room_id: roomId,
      content: message,
    });

    if (error) throw error;

    return { success: true, msg: "sendMessage 성공", data };
  } catch (error) {
    console.log("sendMessage 오류", error);
    return { success: false, msg: "sendMessage 오류", data: [] };
  }
};
