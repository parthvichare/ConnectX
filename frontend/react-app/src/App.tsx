import React,{useState,useEffect,useRef} from 'react'
import axiosInstance from './AxiosInstance'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from './components/signUpAuth/SignIn'
import SignUp from './components/signUpAuth/SignUp'
import Navbar from './components/Navbar';
import io from "socket.io-client"



interface Message {
  message:string,
  messageBy:string,
  conversationId:string | null,
  type: 'text' | 'image' | 'video' | "system"
}

interface NewMessage{
  message:string,
  messageBy:string,
  conversationId: "6751453b7a83ffc8b03c20c0"
}

const App:React.FC = () => {
  const socket = useRef<SocketIOClient.Socket|null>(null)
  const socketUrl = "http://localhost:8000"

  // Sending Message  
  const[currentMessage,setCurrentMessage]=useState<Message>({
    message:'',
    messageBy:'',
    conversationId:'' ,
    type:'text',
  })

  const[text,setText]=useState<NewMessage[] | null>([])

  const userId=localStorage.getItem("userId")

  const handleChange=(e:React.ChangeEvent<HTMLInputElement>)=>{
    setCurrentMessage({ ...currentMessage, [e.target.name]: e.target.value });
  }

  const handleSubmit=(e:React.ChangeEvent<HTMLFormElement>)=>{
    e.preventDefault()
    if(socket.current){
      socket.current.emit("CurrentMessages",{currentMessages:{
        message:currentMessage.message,
        messageBy:userId,
        // conversationId:currentMessage.conversationId,
        conversationId:"6751453b7a83ffc8b03c20c0",
        type:"text"
      }})
    setCurrentMessage((prevState)=>({...prevState,message:""}))
    }
  }



  useEffect(() => {
    // Establish the Socket Connection
    socket.current = io(socketUrl, {
        transports: ['websocket'], // Force WebSocket transport
    });

    // Emit the token on connection
    const token = localStorage.getItem("TOKEN");
    const userId = localStorage.getItem("userId")


    socket.current.emit("Connect", { token,userId });

    // Listen for Messages from Server


    // // socket.current.emit("Newmessage",{Newmessage:{newmessage}, messageBy:{userId}})
    // socket.current.on("Newmessage", (data: {message:string}) => {
    //   console.log("New message received:", data.NewMessage);
    //   console.log("Message by user ID:", data.messageBy);
    //   console.log("Conversation ID:", data.conversationId);

    //  });

    socket.current.on("NewMessage", async(data:{newMessage: NewMessage}) => {
      // Assuming storedMessage is already the message object
        const { message, messageBy, conversationId } = data.newMessage;
        
        if (conversationId) {
            localStorage.setItem("ConvoId", conversationId);
            console.log("Received message:", `${message}:${messageBy}`);
            const newMessage : NewMessage= {message, messageBy, conversationId}
            setText((prevText) => (prevText ? [...prevText, newMessage] : [newMessage]));
        }
      
  });

  
    // Cleanup on component unmount
    return () => {
        socket.current?.disconnect();
    };
}, [socketUrl]);

  return (
    <div>
      {/* <p>Received Message: {data ? JSON.stringify(data) : "No messages yet."}</p> */}
      <Navbar/>
      <Router>
          <Routes>
            <Route path="/user/signUp" element={<SignUp/>} />
            <Route path="/user/signIn" element={<SignIn/>}/>
          </Routes>
      </Router>
      <form onSubmit={handleSubmit}>
      <input type="message" name="message" placeholder='Type Message' value={currentMessage.message} onChange={handleChange} required/>
      <button type="submit">SendMessage</button>
      {text?.map((item)=>(
        <p>{item.message}:{item.messageBy}</p>
      ))}
      </form>
    </div>
  );
}

export default App










// interface ApiResponse{
//   message:string,
//   firstname:string
// }




// const[data,setData]=useState<ApiResponse[] | null>(null)
// const[error,setError]=useState<string| null>(null)

// useEffect(()=>{
//  const fetchData= async()=>{
//    try{
//      const response= await axiosInstance.get<ApiResponse[]>("/user_detail")
//      if(response.data.length>0){
//        setData(response.data)
//      }else{
//        setData([])
//      }
//    }catch(error:unknown){
//      if(error instanceof Error){
//        setError(error.message)
//      }else{
//        setError("An Unknow Error Occured")
//      }
//    }
//  }
//  fetchData()
// })

// if (data==null){
//  return <p>Loading...</p>
// }

// if(error){
//  return <p>{error}</p>
// }

















{/* <h1>User Details</h1>
{data.length === 0 ? (
  <p>No users found</p>
) : (
  data.map((user, index) => (
    <div key={index}>
      <p>First Name: {user.firstname}</p>
    </div>
  ))
)} */}








// import React, { useEffect, useState } from "react";
// import axiosInstance from "./AxiosInstance";

// interface ApiResponse {
//   message: string;
//   redis_data: string;
//   firstname: string;
//   email: string;
// }

// const App: React.FC = () => {
//   const [data, setData] = useState<ApiResponse[] | null>(null);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await axiosInstance.get<ApiResponse[]>("/user_detail");
//         if (response.data.length > 0) {
//           setData(response.data); // Set the array of users
//         } else {
//           setData([]); // Empty array if no users found
//         }
//       } catch (error) {
//         if (error instanceof Error) {
//           setError(error.message);
//         } else {
//           setError("An Unknown Error Occurred");
//         }
//       }
//     };
//     fetchData();
//   }, []);

//   if (error) {
//     return <p>Error: {error}</p>;
//   }

//   if (data === null) {
//     return <p>Loading..</p>;
//   }

//   return (
//     <div>
//       <h1>User Details</h1>
//       {data.length === 0 ? (
//         <p>No users found</p>
//       ) : (
//         data.map((user, index) => (
//           <div key={index}>
//             <p>First Name: {user.firstname}</p>
//             <p>Email: {user.email}</p>
//           </div>
//         ))
//       )}
//     </div>
//   );
// };

// export default App;
