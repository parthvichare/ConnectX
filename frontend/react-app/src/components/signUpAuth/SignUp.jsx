

// interface SignInAPIresponse{
  
// }
import React,{useState} from 'react'
import axiosInstance from '../../AxiosInstance'
import { useNavigate } from 'react-router-dom'

const SignUp = () => {
  const[formData,setFormData]=useState({
    firstname:"",
    email:"",
    password:""
  })
  const[message,setMessage]=useState("")
  const[error,setError]=useState("")
  const navigate= useNavigate()


  const handleChange=(e)=>{
    setFormData({...formData,[e.target.name]:e.target.value})
  }

  const handleSubmit=async (e)=>{
    e.preventDefault()
    try{
      const response = await axiosInstance.post("/user/api/signUp",formData);
      const {userExist,message}= await response.data
      if(userExist){
        setMessage(userExist)
      }else{
        setMessage(message)
      }
      navigate("/user/signIn")
    }catch (err) {
      // Handle the error based on the response status
      if (err.response && err.response.status === 400) {
        setMessage(err.response.data.userexist || "An error occurred.");
      } else {
        setMessage("An error occurred while creating the account."); // General error message
      }
    }
  }

  return (
    <div>
      <div className="laptop-l:w-full laptop:w-full tablet:w-full l:w-full m:w-full s:w-full flex justify-center my-24">
        {/* Display error message */}
        <div class="border-2 h-1/2 py-4 rounded-xl ">
          <div class="mb-3 mx-10 m:mx-5 s:mx-2 s:ml-2">
            <h1 class="text-3xl font-semibold px-2 m:text-2xl s:text-xl ">
              Welcome To Medium
            </h1>
            <p class="mx-2 text-slate-900 m:text-base">
              Sign up to create your Medium Account
            </p>
          </div>
          <div class="border-b-2 border-zinc-950 mb-2"></div>
          <form onSubmit={handleSubmit}>
            <div class="mb-3 mx-2 m:pl-4">
              <p class="text-xl mb-3 m:mx-2 s:mx-8">Name:</p>
              <input
                type="text"
                name="firstname"
                placeholder="First Name"
                onChange={handleChange}
                className="border-2 border-gray-100  w-[350px] m:w-[300px] s:w-[280px] s:ml-8 m:ml-2  px-2 py-1 rounded-full"
                required
              />
            </div>
            <div class="mb-3 mx-2  m:pl-4">
              <p class="text-xl mb-3 m:mx-2 s:ml-8">Email:</p>
              <input
                type="email"
                name="email"
                placeholder="Email"
                onChange={handleChange}
                className="border-2 border-gray-100  w-[350px] m:w-[300px]  s:w-[280px] s:ml-8 m:ml-2 px-2 py-1 rounded-full"
                required
              />
            </div>
            <div class="mx-2  m:pl-4">
              <p class="text-xl mb-3 m:mx-2 s:ml-8 ">Password:</p>
              <input
                type="password"
                name="password"
                placeholder="Password"
                onChange={handleChange}
                className="border-2 border-gray-100  w-[350px]  m:w-[300px] s:w-[280px] s:ml-8 m:ml-2 px-2 py-1 mb-8 rounded-full"
                required
              />
            </div>
            <button
              type="submit"
              className="bg-black w-[350px] m:w-[300px] s:w-[280px] py-1 s:ml-8 hover:bg-gray-600 rounded-full mb-6 m:px-2"
            >
              <span class="text-gray-50">Sign Up</span>
            </button>
          </form>
          <div className="text-1xl mx-24 font-bold m:ml-4">
            <p className="mb-4 flex justify-center m:ml-14 laptop:ml-20">
              Already Have An account
            </p>
            <a
              class="m:flex m:justify-center m:ml-8 s:ml-10"
              href="/user/signIn"
            >
              <span className="font-bold cursor-pointe laptop-l:ml-14">
                LogIn
              </span>
            </a>
          </div>
        </div>
        {message && (
          <p class="fixed top-52 text-2xl text-red-500 font-semibold">
            {message}
          </p>
        )}
        {error && (
         <p class="fixed top-52 text-2xl text-red-500 font-semibold">
           {error}
         </p>
        )}
      </div>
    </div>
  )
}

export default SignUp