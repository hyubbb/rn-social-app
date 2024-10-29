import React, {
  useEffect,
  useRef,
  useState,
  createContext,
  useContext,
} from "react";
import { Socket, io } from "socket.io-client";
import { Platform } from "react-native";

// const SOCKET_DEV = "http://localhost:3001";
const SOCKET_DEV = "http://43.203.41.59:3001";
// const SOCKET_URL = __DEV__
//   ? // ? "http://localhost:3001"  // 개발 환경
//     "http://43.203.41.59:3001" // 프로덕션 환경
//   : "http://43.203.41.59:3001"; // 프로덕션 환경

// Context 타입 정의
interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

// createContext에 타입 지정
export const SocketContext = createContext<SocketContextType | undefined>({
  socket: null,
  isConnected: false,
});

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [isConnected, setIsConnected] = useState(false);
  const socket = useRef<Socket | null>(null);

  useEffect(() => {
    socket.current = io(SOCKET_DEV, {
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      query: {
        platform: Platform.OS,
      },
    });

    socket.current.on("connect", () => {
      console.log("-------Socket connected-------");
      setIsConnected(true);
    });

    socket.current.on("disconnect", () => {
      console.log("-------Socket disconnected-------");
      setIsConnected(false);
    });

    socket.current.on("error", (error) => {
      console.error("-------Socket error-------", error);
    });

    return () => {
      if (socket.current) {
        socket.current.disconnect();
        socket.current.removeAllListeners();
      }
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket: socket.current, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};
