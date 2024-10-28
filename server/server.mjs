import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const app = express();
app.use(cors());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  // 채팅방 참여 이벤트 처리
  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
  });

  socket.on("sendMessage", async (messageData) => {
    try {
      const values = {
        user_id: messageData.userId,
        room_id: messageData.roomId,
        content: messageData.content,
        type: messageData.type || "TEXT",
      };

      const { data: insertData, error: insertError } = await supabase
        .from("messages")
        .insert(values)
        .select("*")
        .single();

      if (!insertData) {
        throw new Error("message insert 오류");
      }

      const { data: fetchData, error: fetchError } = await supabase
        .from("messages")
        .select("*, user:users(*)")
        .eq("id", insertData.id)
        .single();

      if (!fetchData) {
        throw new Error("message fetch 오류");
      }

      io.to(messageData.roomId).emit("message", fetchData);

      return { success: true, msg: "sendMessage 성공", data: fetchData };
    } catch (error) {
      return { success: false, msg: "sendMessage 오류", data: [] };
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

const PORT = 3000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
