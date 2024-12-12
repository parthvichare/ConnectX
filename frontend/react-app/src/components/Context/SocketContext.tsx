// src/components/SocketContext.tsx
import React, { createContext, useEffect, useState, useContext } from "react";
import { io, Socket } from "socket.io-client";
import { useLocation, useParams } from "react-router-dom";


interface SocketContextType{
  socket: Socket | null,
}

interface MyComponentProps{
  children: React.ReactNode;
}


// Create a context for the socket
export const SocketContext = createContext<SocketContextType|null>(null);


// SocketProvider component to provide the socket instance to the app
export const SocketProvider: React.FC<MyComponentProps> = ({ children }) => {
  const [socket, setSocket] = useState<SocketContextType | null>(null);
  const socketUrl = "http://localhost:8000"; // Define your socket server URL here

  // Retrieve token and userId from local storage
  const token = localStorage.getItem("TOKEN");
  const userId = localStorage.getItem("AdminId");

  useEffect(() => {
    // Initialize the socket connection
    const newSocket = io(socketUrl, {
      transports: ["websocket"],
    });

    // Emit the connection event
    newSocket.emit("Connect", { token, userId });

    setSocket({socket:newSocket});

    // Listen for connection events
    newSocket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });

    // newSocket.on("disconnect", (reason) => {
    //   // console.log("Socket disconnected:", reason);
    // });

    // Cleanup on component unmount
    return () => {
      // Optionally disconnect the socket on unmount (uncomment if needed)
      // newSocket.disconnect();
      setSocket(null); // Clear the socket state
    };
  }, [socketUrl]); // Dependency on socket URL ensures connection is established


  return (
    <SocketContext.Provider value={socket}>
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
