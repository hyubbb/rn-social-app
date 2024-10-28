import { supabase } from "@/lib/supabase";

export const fetchChat = async ({
  userId,
  otherUserId,
}: {
  userId: string;
  otherUserId: string;
}) => {
  try {
    const { data, error } = await supabase
      .from("chatUsers")
      .select("*")
      .eq("user_id", userId)
      .eq("other_user_id", otherUserId);

    if (error) throw error;
    return { success: true, msg: "fetchChat 성공", data };
  } catch (error) {
    console.log("fetchChat 오류", error);
    return { success: false, msg: "fetchChat 오류", data: [] };
  }
};

export const fetchChatRooms = async (userId: string) => {
  try {
    // 1. 먼저 내가 속한 방들의 ID를 가져옴
    const { data: myRooms } = await supabase
      .from("chatUsers")
      .select("*")
      .eq("user_id", userId);

    const roomIds = myRooms?.map((room) => room.room_id);
    // 2. 그 방들에 있는 다른 사용자들의 정보를 가져옴
    const { data, error } = await supabase
      .from("chatUsers")
      .select("*, users:user_id(*)")
      .in("room_id", roomIds as string[])
      .neq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return { success: true, msg: "fetchChatUsers 성공", data };
  } catch (error) {
    console.log("fetchChatUsers 오류", error);
    return { success: false, msg: "fetchChatUsers 오류", data: [] };
  }
};

export const createChatRoom = async ({
  userId,
  otherUserId,
}: {
  userId: string;
  otherUserId: string;
}) => {
  try {
    // 1. 채팅방 생성
    const { data: roomData, error: roomError } = await supabase
      .from("chatRooms")
      .insert({})
      .select()
      .single();
    if (roomError) throw roomError;

    // 2. chatUsers에 사용자 추가
    const { data: userData, error: userError } = await supabase
      .from("chatUsers")
      .insert([
        {
          user_id: userId,
          other_user_id: otherUserId,
          room_id: roomData.id,
        },
        {
          user_id: otherUserId,
          other_user_id: userId,
          room_id: roomData.id,
        },
      ])
      .select();

    if (userError) throw userError;

    return { success: true, msg: "createChatRoom 성공", data: roomData };
  } catch (error) {
    console.log("createChatRoom 오류", error);
    return { success: false, msg: "createChatRoom 오류", data: [] };
  }
};

export const sendMessage = async ({
  userId,
  roomId,
  message,
}: {
  userId: string;
  roomId: string;
  message: string;
}) => {
  try {
    const { data: messageData, error } = await supabase
      .from("messages")
      .insert({
        user_id: userId,
        room_id: roomId,
        content: message,
      })
      .select("*")
      .single();
    console.log("messageData", messageData);

    if (error) throw error;

    return { success: true, msg: "sendMessage 성공", data: messageData };
  } catch (error) {
    console.log("sendMessage 오류", error);
    return { success: false, msg: "sendMessage 오류", data: [] };
  }
};

export const fetchMessages = async (roomId: string) => {
  try {
    const { data, error } = await supabase
      .from("messages")
      .select("*, user:user_id(*)")
      .eq("room_id", roomId);
    if (error) throw error;

    return { success: true, msg: "fetchMessages 성공", data };
  } catch (error) {
    console.log("fetchMessages 오류", error);
    return { success: false, msg: "fetchMessages 오류", data: [] };
  }
};
