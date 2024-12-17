import React, { useEffect, useState, useContext} from "react";
import { SocketContext } from './Context/SocketContext';// Ensure you import from the correct path
import { useLocation, useParams, useNavigate } from "react-router-dom";

interface MessageFormat{
  message:string,
  messageBy:string,
  messageTo:string,
  conversationId: string,
}

// interface UserInfo{
//   firstname:string
// }


const PrivateChat: React.FC = () => {
  // const socket = useContext(SocketContext); // Access the socket from context
  const {sendMessage,socket} = useContext(SocketContext) || {}
  const [data, setData] = useState<string | null>(null);
  const { convoId: initialConvoId } = useParams<{convoId:string}>()

  const navigate = useNavigate();
  const [currentMessage, setCurrentMessage] = useState<MessageFormat>({
    message: "",
    messageBy: "",
    messageTo: "",
    conversationId: "" 
  });
  const [userDetail, setUserDetail] = useState<string|null>(null);

  const location = useLocation();

  const { messageTo } = location.state || {};

  //LocalStorage
  const localuserId = localStorage.getItem("AdminId");


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentMessage({
      ...currentMessage,
      [e.target.name]: e.target.value,
    });
  };


  // const handleMessageSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   console.log("Message");
  //   if (socket?.socket) {
  //     socket.socket.emit("CurrentMessages", {
  //       NewMessage: {
  //         message: currentMessage.message,
  //         messageBy: localuserId,
  //         messageTo: messageTo,
  //         conversationId: initialConvoId,
  //       },
  //     });

  //     // Clear the input field after sending
      // setCurrentMessage((prevState) => ({
      //   ...prevState,
      //   message: "",
      // }));
  //   }
  // };

  const handleMessageSubmit=(e:React.FormEvent<HTMLFormElement>)=>{
    e.preventDefault()
    
    if(sendMessage){
      sendMessage({
        message: currentMessage.message,
        messageBy: localuserId || '',
        messageTo: messageTo || "",
        conversationId: initialConvoId || ""
      })
      setCurrentMessage((prevState) => ({
        ...prevState,
        message: "",
      }));
    }
  }

  useEffect(() => {
    if (!socket || !messageTo) return; // Ensure socket is available

      // Listen for incoming messages
      if (socket) {

        socket.emit("UserInfo",({ messageTo }));

        socket.on("userDetail",async(data:{firstname:string})=>{
          if(data.firstname){
            setUserDetail(data.firstname)
          }
        })


        // socketConnect.("message", ({ message }: { message: string }) => {
        //   setData(message);
        // });

        socket.emit("FetchMessage", { initialConvoId });

        // socketConnect.on("AllMessages", (data: { messages: MessageFormat[] }) => {
        //   setMessage(data.messages);
        // });
  
        socket.on("NewMessage", ({ currentMessage }) => {
          if (currentMessage) {
            const { conversationId } = currentMessage;
            // Navigate to the private chat for the conversation
            navigate(`/ConnectX/c/${conversationId}`,{state:{messageTo}});
          }
        });
      }

    // Cleanup listener on unmount
    return () => {
      if(socket){
        const socketOff = socket
        socketOff.off("message"); // Remove the message listener
        socketOff.off("AllMessages"); // Remove the AllMessages listener
      }
    };
  }, [socket, messageTo]); // Add socket as a dependency


  console.log("Private Chat with",{userDetail})

  return (
    <div className="private-chat">
      <h2>Private Chat</h2>
      <p>Data: {data}</p>
      <p>Private Chat with  {userDetail}</p>
      <form onSubmit={handleMessageSubmit}>
        <input
          type="text"
          name="message"
          placeholder="Type a message"
          onChange={handleInputChange}
          value={currentMessage.message}
          required
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default PrivateChat;





