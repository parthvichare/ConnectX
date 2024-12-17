// import React,{useState,useEffect,useRef} from 'react'
// import axiosInstance from './AxiosInstance'
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import SignIn from './components/signUpAuth/SignIn'
// import SignUp from './components/signUpAuth/SignUp'
// import Navbar from './components/Navbar';
// import { io, Socket } from "socket.io-client";
// // import AllUsers from './components/AllUsers';
// import PrivateChat from './components/PrivateChat';
// import ChatRoom from './components/ChatRoom';


// import Users from './components/Users';

// interface Message {
//   message:string,
//   messageBy:string,
//   conversationId:string | null,
//   type: 'text' | 'image' | 'video' | "system"
// }

// interface NewMessage{
//   message:string,
//   messageBy:string,
//   conversationId: string
// }


// const App:React.FC = () => {
//   const socketUrl = "http://localhost:8000";

//   const socketRef = useRef<Socket | null>(null);

//   // Sending Message  
//   const convoId= localStorage.getItem("ConvoId")
//   const[currentMessage,setCurrentMessage]=useState<Message>({
//     message:'',
//     messageBy:'',
//     conversationId:convoId,
//     type:'text',
//   })

//   const[text,setText]=useState<NewMessage[] | null>([])

//   const userId=localStorage.getItem("userId")

//   const handleChange=(e:React.ChangeEvent<HTMLInputElement>)=>{
//     setCurrentMessage({ ...currentMessage, [e.target.name]: e.target.value });
//   }


//   const handleSubmit=(e:React.ChangeEvent<HTMLFormElement>)=>{
//     e.preventDefault()
//     if(socket.current){
//       socket.current.emit("CurrentMessages",{currentMessages:{
//         message:currentMessage.message,
//         messageBy:userId,
//         conversationId:currentMessage.conversationId,
//         // conversationId:"6751453b7a83ffc8b03c20c0",
//         type:"text"
//       }})
//     setCurrentMessage((prevState)=>({...prevState,message:""}))
//     }
//   }



//   useEffect(() => {
//     // Establish the Socket Connection
//     socket.current = io(socketUrl, {
//         transports: ['websocket'], // Force WebSocket transport
//     });

//     // Emit the token on connection
//     const token = localStorage.getItem("TOKEN");
//     const userId = localStorage.getItem("userId")
//     const convoId= localStorage.getItem("ConvoId")


//     socket.current.emit("Connect", { token,userId });
//     // socket.current.emit("FetchAllMessageHistory", {userId,convoId})


//     socket.current.on("GetAllMessage", (data:{allMessages:NewMessage}) => {
//       try {
//         const allMessages = data.allMessages; // Expecting an array of messages
//         if (Array.isArray(allMessages)) {
//           // Process each message in the array
//           allMessages.forEach(({ message, messageBy, conversationId }) => {
//             const newMessage = { message, messageBy, conversationId };
//             setText((prevText) => (prevText ? [...prevText, newMessage] : [newMessage]));
//           });
//         }
//         console.log(allMessages); // Log all messages for debugging
//       } catch (error) {
//         console.error("Error handling GetAllMessage:", error);
//       }
//     });

//     // Listen for Messages from Server


//     // // socket.current.emit("Newmessage",{Newmessage:{newmessage}, messageBy:{userId}})
//     // socket.current.on("Newmessage", (data: {message:string}) => {
//     //   console.log("New message received:", data.NewMessage);
//     //   console.log("Message by user ID:", data.messageBy);
//     //   console.log("Conversation ID:", data.conversationId);

//     //  });

//   //   socket.current.on("NewMessage", async(data:{newMessage: NewMessage}) => {
//   //     // Assuming storedMessage is already the message object
//   //       const { message, messageBy, conversationId } = data.newMessage;
        
//   //       if (conversationId) {
//   //           localStorage.setItem("ConvoId", conversationId);
//   //           console.log("Received message:", `${message}:${messageBy}`);
//   //           const newMessage : NewMessage= {message, messageBy, conversationId}
//   //           setText((prevText) => (prevText ? [...prevText, newMessage] : [newMessage]));
//   //       }
      
//   // });

  
//     // Cleanup on component unmount
//     return () => {
//         socket.current?.disconnect();
//     };
// }, [socketUrl]);

//   if(!text){
//     return <h1>Messages Loading</h1>
//   }

//   return (
//     <div>
//       {/* <p>Received Message: {data ? JSON.stringify(data) : "No messages yet."}</p> */}
//       <Navbar/>
//       <Router>
//           <Routes>
//             <Route path="/user/signUp" element={<SignUp/>} />
//             <Route path="/user/signIn" element={<SignIn/>}/>
//             {/* <Route path="/allusers"    element={<AllUsers socket={socket.current}/>}/> */}
//             <Route path="/allusers" element={<Users/>}/>
//             <Route path="/private-chat" element={<PrivateChat socket={socket}/>}/>
//             <Route path="/private-chat/:convoId" element={<ChatRoom/>}/>
//           </Routes>
//       </Router>
//       {/* <form onSubmit={handleSubmit}>
//       <input type="message" name="message" placeholder='Type Message' value={currentMessage.message} onChange={handleChange} required/>
//       <button type="submit">SendMessage</button>
//       {text?.slice(-5).reverse().map((item)=>(
//         <p>{item.message}:{item.messageBy}</p>
//       ))}
//       </form> */}
//     </div>
//   );
// }

// export default App





// App.tsx
import React, { useEffect, useRef,useState,useContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import { io, Socket} from "socket.io-client";
import SignIn from "./components/signUpAuth/SignIn";
import SignUp from "./components/signUpAuth/SignUp";
import PrivateChat from "./components/PrivateChat";
import Navbar from './components/Navbar';
import Users from "./components/Users";
import ChatRoom from "./components/ChatRoom";

const App: React.FC = () => {
  // const socket = useContext(SocketContext)
  const [data, setData] = useState<string | null>(null);

  const token= localStorage.getItem("TOKEN")
  const localuserId = localStorage.getItem("userId")


  return (
    <div>
      <Navbar />
      <Router>
        <Routes>
          <Route path="/ConnectX/user/signUp" element={<SignUp />} />
          <Route path="/ConnectX/user/signIn" element={<SignIn />} />
          <Route path="/ConnectX/c" element={<PrivateChat />} />
          <Route path="/ConnectX/users" element={<Users/>}/>
          <Route path="/ConnectX/c/:convoId" element={<ChatRoom/>}/>
        </Routes>
      </Router>
    </div>
  );
};


export default App;


