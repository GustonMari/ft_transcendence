import { createContext } from "react";
import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import Create_socket from "../network/chat.socket";

interface GlobalSocketContextInterface {
  socket: Socket | null;
}

const GlobalSocketContext = createContext<GlobalSocketContextInterface>({
  socket: null,
});

export const GlobalSocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket>();

  useEffect(() => {
    const initializeSocket = async () => {
      const socket = await Create_socket();
      setSocket(socket);
    };

    initializeSocket();

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  if (!socket) {
    return <div>Loading...</div>;
  } else {
    return (
      <GlobalSocketContext.Provider value={{ socket }}>
        {children}
      </GlobalSocketContext.Provider>
    );
  }
};