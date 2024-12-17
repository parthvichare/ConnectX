import React, { useState, useEffect, useRef,useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { SocketContext } from "./Context/SocketContext";

//Fetching UserDetails Type
interface AllUser{
  _id:string,
  firstname:string,
  email:string,
  status:string,
}

interface OnlineUser{
  _id:string,
  status:string
}

interface userDetailStatus{
  _id:string,
  firstname:string,
  status: string
}


const Users = () => {

  const socket = useContext(SocketContext)

  const[userDetail,setUserDetail]=useState<AllUser[]>([])
  
  const [userOnline,setUserOnline] = useState<OnlineUser[]>([])       //State for Active/InActive Status of User
 
  const [updatedUserDetail, setUpdatedUserDetail] = useState<userDetailStatus[]>([]);  // Managing userOnline and userDetail to update the Status

  const SocketConnect = socket?.socket

  const AdminId:string| null= localStorage.getItem("AdminId")
  const navigate = useNavigate()

  //Socket to Fetch All User Details on who is Offline / Online
  useEffect(()=>{
    if(!SocketConnect) return


    if(SocketConnect){
      SocketConnect.emit("FetchUserDetail",{AdminId})

      SocketConnect.on("AllUsers",async(data:{users:AllUser[]})=>{
          const allUsers = data.users
          const filteredUser=allUsers.filter((item)=>item._id!==AdminId)
          setUserDetail(filteredUser)
      })

      SocketConnect.on("OnlineUsers", async(data:{Users:userDetailStatus[]})=>{
        console.log(data.Users)
        setUserOnline(data.Users)
      })
    }
    return () => {
      if(SocketConnect){
        SocketConnect.off("AllUsers");
      }
    };
  }, [socket, AdminId]);

  console.log("Onlines",userOnline)


  // Upadting Status based on User Online/Offline 
  useEffect(() => {
    const updatedDetails = userDetail.map(user => {
        const statusEntry = userOnline.find(onlineUser => onlineUser._id === user._id);

       return {
         ...user,
         status: statusEntry ? "Online"  : "Offline" // Update status based on online users
       };
    });

    setUpdatedUserDetail(updatedDetails); // Store the updated details in state
  }, [userDetail, userOnline]); // Re-run this effect when userDetail or userOnline changes


  console.log("Update",updatedUserDetail)

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
            navigate('/ConnectX/c', { state: { messageTo }  });
          } else {
            navigate(`/ConnectX/c/${convoId}`, {state: {messageTo}});
          }
        });
      }
    } catch (error) {
      console.error("Error in navigateToConversation:", error);
    }
  };

  console.log("User Detail Status",updatedUserDetail)



  return (
    <div>
      <div className="flex justify-center text-4xl font-bold">
      <p>All Users</p>
      </div> 
      <div>
      {updatedUserDetail.map((item) => (
        <div className="flex">
          <button type="button" className="px-10 mb-20" onClick={()=>navigateToConversation(item._id)}>
            <div className="flex mb-6">
            <p>{item.firstname}</p>
            <button className={`${item.status==="Online" ? "bg-lime-600":"bg-red-500"} px-2 ml-10`}>{item.status}</button>
            </div>
          </button>
        </div>
      ))}
      </div> 
      
    </div>
  );
};

export default Users;
