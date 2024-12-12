import React from 'react'
import { useNavigate } from 'react-router-dom'

const SignOut = () => {
   const handleSignOut=()=>{
     localStorage.removeItem("TOKEN")
     localStorage.removeItem("userId")
     window.location.href = "/user/signIn"; // Redirects to the login page
   }
  return (
    <div>
      <button onClick={handleSignOut}>SignOut</button>
    </div>
  )
}

export default SignOut