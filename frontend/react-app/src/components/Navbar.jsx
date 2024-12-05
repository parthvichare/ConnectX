import React from 'react'
import SignOut from './signUpAuth/SignOut'

const Navbar = () => {
  return (
    <div>
    <ul>
      <a href="/user/signIn">
       <li>SignIn</li>
      </a>
      <a href="/user/signUp">
      <li>SignUp</li>
      </a>
      <SignOut/>
    </ul>
    </div>
  )
}

export default Navbar