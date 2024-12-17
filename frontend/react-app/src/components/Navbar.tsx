import React from 'react'
import SignOut from './signUpAuth/SignOut'


const Navbar = () => {
  return (
    <div>
    <ul className="flex justify-center space-x-3">
      <a href="/ConnectX/user/signIn">
       <li>SignIn</li>
      </a>
      <a href="/ConnectX/user/signUp">
      <li>SignUp</li>
      </a>
      <a href="/ConnectX/users">
        <li>Users</li>
      </a>
      <SignOut/>

    </ul>
    </div>
  )
}

export default Navbar