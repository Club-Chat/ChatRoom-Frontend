import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

type ChatSocketContextType = {
  socket: WebSocket | null;
  isConnected: boolean;
  sendMessage: (message: string) => void;
};

const ChatSocketContext = createContext<
  ChatSocketContextType | undefined
>(undefined);

export const useChatSocket = () => {
  const context = useContext(ChatSocketContext);

  if (!context) {
    throw new Error(
      "useChatSocket must be used within a ChatSocketProvider"
    );
  }

  return context;
};

type Props = {
  children: React.ReactNode;
  roomId: number | null;
};

export const ChatSocketProvider: React.FC<Props> = ({
  children,
  roomId,
}) => {
  const [isConnected, setIsConnected] = useState(false);

  // IMPORTANT:
  // useState instead of useRef so components rerender properly
  const [socket, setSocket] = useState<WebSocket | null>(null);


const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);


  useEffect(() => {
  if (!roomId) {
    setSocket(null);
    setIsConnected(false);
    return;
  }

  let ws: WebSocket;

  const connectWebSocket = () => {
    console.log("Creating websocket...");

    // const protocol =
    //   window.location.protocol === "https:"
    //     ? "wss:"
    //     : "ws:";

    const wsBase =
  import.meta.env.VITE_WS_URL || "wss://2526-150-129-146-122.ngrok-free.app";

const wsUrl = `${wsBase}/ws/chat/${roomId}/`;

console.log("Connecting to:", wsUrl);

const ws = new WebSocket(wsUrl);

    setSocket(ws);

    ws.onopen = () => {
      console.log("✅ WebSocket connected");
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      console.log("📨 Incoming:", event.data);
    };

    ws.onerror = (error) => {
      console.error("❌ WebSocket error:", error);
    };

    ws.onclose = () => {
      console.log("❌ WebSocket disconnected");

      setIsConnected(false);

      reconnectTimeoutRef.current = setTimeout(() => {
        console.log("🔄 Reconnecting...");
        connectWebSocket();
      }, 5000);
    };
  };

  connectWebSocket();

  return () => {
    console.log("Closing socket for room:", roomId);

    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }

    // ws?.close();
  };
}, [roomId]);

  const sendMessage = (message: string) => {
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      console.error("WebSocket is not connected");
      return;
    }

    socket.send(
      JSON.stringify({
        message,
      })
    );

    console.log("📤 Sent:", message);
  };

  return (
    <ChatSocketContext.Provider
      value={{
        socket,
        isConnected,
        sendMessage,
      }}
    >
      {children}
    </ChatSocketContext.Provider>
  );
};

