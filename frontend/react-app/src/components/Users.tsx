import React, { useState, useEffect, useRef,useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { SocketContext } from "./Context/SocketContext";

//Fetching UserDetails Type
interface AllUser{
  _id:string,
  firstname:string,
  email:string
}


const Users = () => {

  const socket = useContext(SocketContext)
  const [data, setData] = useState([]);
  const[userDetail,setUserDetail]=useState<AllUser[]>([])

  const AdminId:string| null= localStorage.getItem("AdminId")
  const navigate = useNavigate()

  //Socket to Fetch All User Details on who is Offline/ Online
  useEffect(()=>{
    if(!socket?.socket) return

    if(socket?.socket){
      socket.socket.emit("FetchUserDetail",{AdminId})

      socket.socket.on("AllUsers",async(data:{users:AllUser[]})=>{
          const allUsers = data.users
          const filteredUser=allUsers.filter((item)=>item._id!==AdminId)
          setUserDetail(filteredUser)
      })
    }

    return () => {
      if(socket?.socket){
        socket.socket.off("AllUsers");
      }
    };
  }, [socket, AdminId]);


  // Logic Of Navigating to User based on Conversation-Id null | Available
  const navigateToConversation = async (messageTo: string) => {
    if (!socket?.socket) return;
  
    try {
      if(socket?.socket){
        //Emiting to socket for handling Navigation based on coversationId Avability!
        socket.socket.emit("GetConversationId", ({ AdminId, messageTo }));


        socket.socket.on("Conversation", ({convoId}) => {
          if (!convoId) {
            // console.log("MessageTo",messageTo)
            navigate('/ConnectX/private-chat', { state: { messageTo }  });
          } else {
            navigate(`/ConnectX/private-chat/${convoId}`);
          }
        });
      }
    } catch (error) {
      console.error("Error in navigateToConversation:", error);
    }
  };
  

  return (
    <div>
      <div className="flex justify-center text-4xl font-bold">
      <p>All Users</p>
      </div>
      <div>
      {userDetail.map((item) => (
        <div className="flex">
          <button type="button" className="px-10" onClick={()=>navigateToConversation(item._id)}>
            {item.firstname}
          </button>
        </div>
      ))}
      </div>
    </div>
  );
};

export default Users;
