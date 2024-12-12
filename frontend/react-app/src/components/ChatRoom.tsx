import React, { useEffect, useState, useContext} from "react";
import { SocketContext } from "./Context/SocketContext"; // Ensure you import from the correct path
import {useParams} from "react-router-dom";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

interface MessageFormat{
  message:string,
  messageBy:string,
  messageTo:string,
  conversationId:string
}

const ChatRoom:React.FC = () => {
  const socket =useContext(SocketContext)
  const { convoId: initialConvoId } = useParams();
  const[message, setMessage] =useState<MessageFormat[]>([])
  const[messageTo,setMessageTo] =useState<string|null>(null)
  const [currentMessage, setCurrentMessage] = useState<MessageFormat>({
    message: "",
    messageBy: "",
    messageTo:"",
    conversationId: initialConvoId || "",
  });
  const[userDetail,setUserDetail] =useState<string|null>(null)
  const[data,setData]=useState<string|null>(null)

  const location = useLocation()

  // const { messagesendTo } = location.state || {};
  


  const handleInputChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    setCurrentMessage({
      ...currentMessage,
      [e.target.name]: e.target.value,
    });
  };


  const handleMessageSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const localUserId = localStorage.getItem("AdminId");


    if (socket?.socket) {
      socket.socket.emit("CurrentMessages", {
        NewMessage: {
          message: currentMessage.message,
          messageBy: localUserId,
          messageTo: messageTo,
          conversationId: initialConvoId || null,
        },
      });

      // Clear the input field after sending
      setCurrentMessage((prevState) => ({
        ...prevState,
        message: "",
      }));
    }
  };

  //Mount NewMessage and All Message when user Navigate to (show message History)
  useEffect(()=>{
    if (!socket?.socket) return; // Ensure socket is available
    if(socket?.socket){
      const socketConnect = socket.socket
      socket.socket.emit("FetchMessage", ({initialConvoId}))

      socketConnect.on("message", async({message})=>{
        setData(message)
      })


      socket.socket.on("AllMessages", (data: { messages: MessageFormat[] }) => {
        setMessage(data.messages);
        if (data.messages.length > 0) {
          // Safely access the last message
          const messageTo = data.messages[data.messages.length - 1]?.messageTo;
          setMessageTo(messageTo  || ""); // Use empty string if undefined
          socketConnect.emit("UserInfo",({ messageTo  }));
        }
      });


      socketConnect.on("userDetail",async(data:{firstname:string})=>{
        if(data.firstname){
          setUserDetail(data.firstname)
        }
      })

      socket.socket.on("NewMessage", async(data:{currentMessage:MessageFormat})=>{
        // setMessage(data.currentMessage)
        setMessage((prevState) => [...prevState, data.currentMessage]);
      })
    }

    return () => {
      if(socket?.socket){
        socket.socket.off("AllMessages");
        socket.socket.off("NewMessage");
      }
    };

  },[socket])
  

  return (
    <div>
      <p>Private Chat with {userDetail}</p>
     {message.map((item)=>(
        <p>{item.message}:{item.messageBy}</p>
      ))} 
      <div className="absolute bottom-0 left-0 w-full h-32 flex justify-center bg-gray-100 p-4">
      <form onSubmit={handleMessageSubmit}>
        <input
          type="text"
          name="message"
          placeholder="Type a message"
          onChange={handleInputChange}
          value={currentMessage.message}
          className="w-[700px] h-16"
          required
        />
         <button type="submit">Send</button>
      </form> 
      </div>
    </div>
  )
}

export default ChatRoom

























// import React,{useEffect,useState,useRef,useContext} from "react";
// import { useLocation, useParams, useNavigate } from "react-router-dom";
// import { SocketContext } from "./SocketContext"; // Ensure you import from the correct path
// import axios from "axios";


// const ChatRoom = () => {
//   const socket = useContext(SocketContext); // Access the socket from context
//   const location = useLocation()
//   const { convoId: initialConvoId } = useParams();
  
//   const { userId, userName } = location.state || {};
//   const [data, setData] = useState<string>("");
//   const[message,setMessage]=useState([])
//   const[messageTo,setMessageTo]=useState(null)
//   // const[messageTo,setMessageTo] = useState("")
//   const [currentMessage, setCurrentMessage] = useState({
//     message: "",
//     messageBy: "",
//     messageTo: "",
//     conversationId: initialConvoId || "",
//   });



//   console.log(initialConvoId)

  // useEffect(() => {
  //   const fetchMessages = async () => {
  //     try {
  //       const response = await axios.get(`http://localhost:8000/api/${initialConvoId}`);
  //       const {message} =response.data
  //       setMessage(message)
  //       if (message.length > 0) {
  //         const lastMessageTo = message[message.length - 1].messageTo; // Get the last messageTo
  //         setMessageTo(lastMessageTo); // Store it as a string
  //       }
  //     } catch (error) {
  //       console.error("Error fetching messages:", error);
  //     }
  //   };

  //   fetchMessages();
  // }, []);



//   console.log("MessageTo",messageTo)

//   // const handleEvent=(e:React.ChangeEvent<HTMLInputElement>)=>{
//   //   e.preventDefault()
//   //   if(socket){
//   //     socket.emit("UserInfo", { message: "Hello from React" });
//   //   }
//   // }

//   //   // Handle message input changes
//   // const handleInputChange = (e: React.FormEvent<HTMLFormElement>) => {
//   //   setCurrentMessage({
//   //     ...currentMessage,
//   //     [e.target.name]: e.target.value,
//   //   });
//   // };
//   // // console.log(userId)
//   // // const localUserId = localStorage.getItem("userId");

//   // // if(message.length>0){
//   // //   const lastMessageTo = message[message.length - 1].messageTo; // Get the last messageTo
//   // //   setMessageTo(lastMessageTo); // Store it as a string
//   // // }

//   // // console.log("Message", message)

//   // // // Handle form submission
//   // const handleMessageSubmit = (e) => {
//   //   e.preventDefault();
//   //   if (socket.current) {
//   //     socket.current.emit("CurrentMessages", {
//   //       NewMessage: {
//   //         message: currentMessage.message,
//   //         messageBy: localUserId,
//   //         messageTo: messageTo,
//   //         conversationId: initialConvoId || null,
//   //       },
//   //     });

//   //     // Clear the input field after sending
//   //     setCurrentMessage((prevState) => ({
//   //       ...prevState,
//   //       message: "",
//   //     }));
//   //   }
//   // };


//   const localUserId = localStorage.getItem("userId");
//   console.log(initialConvoId)

//   useEffect(() => {
//     if (!socket) return; 
  
//     // Listen for messages from the server
//     socket.on("message", async ({ message }) => {
//       setData(message);
//     });

//     socket.emit("FetchAllMessages",({initialConvoId}))


//     socket.on("AllMessage", async({allMessage})=>{
//       try{
//         if(allMessage){
//           setMessage(allMessage)
//         }
//       }catch(error){
//         console.log("Message")
//       }
//     })

//     console.log(message)




//   //   // socket.emit.on("fetchAllMessageHistory", ({localUserId=}))
//   //   console.log("UserInfo",initialConvoId)



//   //   // socket.current.emit("AllMessage",({initialConvoId}))


//   //   // socket.current.emit("FetchAllMessageHistory",({localUserId,initialConvoId}))
//   //   socket.current.emit("FetchAllMessageHistory",({messages:"Hello"}))

//   //   // socket.current.on("GetAllMessage", async({data: allMessages})=>{
//   //   //     const{message}= data
//   //   //     setMessage(message)
//   //   // })
//   //   // console.log(message)



//   //   // socket.current.on("NewMessage", async({currentMessage})=>{
//   //   //   try{
//   //   //     // setMessage({...message,currentMessage})
//   //   //   }catch(error){
//   //   //     console.error(error.message)
//   //   //   }
//   //   // })

//   //   // socket.current.emit("FetchAllMessageHistory", ({localUserId,initialConvoId}))



//   //   // socket.current.on("GetAllMessage",async({allMessages})=>{
//   //   //   try{
//   //   //     setMessage(allMessages)
//   //   //     console.log(message)
//   //   //     // console.log(message)
//   //   //     // if (message.length > 0) {
//   //   //     //   const lastMessageTo = message[message.length - 1].messageTo; // Get the last messageTo
//   //   //     //   setMessageTo(lastMessageTo); // Store it as a string
//   //   //     // }
//   //   //   }catch(error){
//   //   //     console.error(error.message)
//   //   //   }
//   //   // })
  
//   //   // Cleanup on component unmount
//   //   return () => {
//   //     socket.current.disconnect();
//   //   };
//   }, [initialConvoId]); // Ensure userId is included in the dependencies



//   return (
//     <div>
//       <h2>Chat Room</h2>
//       <p>{initialConvoId}</p>
//       <p>UserName:{userName}</p>
//       <p>Data:{data}</p>
//       {/* <button onClick={handleEvent}>Click Me</button> */}
// {/* 
//       <form onSubmit={handleMessageSubmit}>
//         <input
//           type="text"
//           name="message"
//           placeholder="Type a message"
//           onChange={handleInputChange}
//           value={currentMessage.message}
//           required
//         />
//          <button type="submit">Send</button>
//       </form>
//       <div>
//         {message.map((message, index) => (
//           <div key={index}>
//             <p>
//               <strong>{message.messageBy === userId ? "You" : message.messageBy}:</strong> {message.message}
//             </p>
//           </div>
//         ))}
//       </div> */}
//     </div>
//   );
// };

// export default ChatRoom;
