// src/components/SocketContext.tsx
import React, { createContext, useEffect, useState, useContext } from "react";
import { io, Socket } from "socket.io-client";
import { useLocation, useParams } from "react-router-dom";


interface SocketContextType{
  socket: Socket | null,
  sendMessage:(payload:MessagePayload)=>void
}

interface MyComponentProps{
  children: React.ReactNode;
}

type MessagePayload={
  message: string,
  messageBy: string,
  messageTo:string,
  conversationId:string,
}

interface SendMessageParams {
  message: string;
  messageBy: string;
  messageTo: string;
  conversationId: string  // Allow conversationId to be null
}

// Create a context for the socket
export const SocketContext = createContext<SocketContextType|null>(null);


// SocketProvider component to provide the socket instance to the app
export const SocketProvider: React.FC<MyComponentProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const socketUrl = "http://localhost:8000"; // Define your socket server URL here
  // const [currentMessage, setCurrentMessage] = useState<MessageFormat>({
  //   message: "",
  //   messageBy: "",
  //   messageTo: "",
  //   conversationId: "",
  // });

  // Retrieve token and userId from local storage
  const token = localStorage.getItem("TOKEN");
  const userId = localStorage.getItem("AdminId");



  useEffect(() => {
    // Initialize the socket connection
    const newSocket = io(socketUrl, {
      transports: ["websocket"],
    });

    setSocket(newSocket)
    // Emit the connection event
    newSocket.emit("Connect", { token, userId,status:{user:"Online"}  });

    // Listen for connection events
    newSocket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });

    newSocket.on("disconnect", (reason) => {
      // console.log("Socket disconnected:", reason);
    });

    // Cleanup on component unmount
    return () => {
      // Optionally disconnect the socket on unmount (uncomment if needed)
      // newSocket.disconnect();
      // newSocket.disconnect(); // Disconnect the socket on unmount
      setSocket(null)
    };
  }, [socketUrl]); // Dependency on socket URL ensures connection is established


  const sendMessage=(params:SendMessageParams)=>{
    if(socket){
      socket.emit("CurrentMessages", { NewMessage:params })
    }
  }


  return (
    <SocketContext.Provider value={{socket,sendMessage}}>
      {children}
    </SocketContext.Provider>
  );
};

// Custom hook to use the socket context in components
export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};



// Custom hook to use the socket
// export const useSocket = () => {
//   const context = useContext(SocketContext);
//   if (!context) {
//     throw new Error("useSocket must be used within a SocketProvider");
//   }
//   return context;
// };
