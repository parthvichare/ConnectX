import React,{useState} from 'react'
import axiosInstance from '../../AxiosInstance'
import { useNavigate } from 'react-router-dom'

const SignIn = () => {
  const[formData,setFormData] = useState({
    email:"",
    password:""
  })
  const[message,setMessage]=useState("")
  const navigate= useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axiosInstance.post("/user/api/signIn", formData);
  
      if (response.status === 200) {
        // Successful login
        const { LoginSuccessful, usertoken,userId } = response.data;
        setMessage(LoginSuccessful);
        localStorage.setItem("TOKEN", usertoken.token);
        localStorage.setItem("AdminId", userId)
        navigate('/users')
      } else {
        setMessage("Unexpected response. Please try again.");
      }
    } catch (err) {
      if (err.response) {
        // Handle error based on status code
        if (err.response.status === 400) {
          setMessage(err.response.data.Loginfailed);
        } else if (err.response.status === 500) {
          setMessage(err.response.data.Error);
        } else {
          setMessage("An unknown error occurred. Please try again.");
        }
      } else {
        setMessage("Network Error. Please check your connection.");
      }
    }
  };
  

  return (
    <div>
    <div className="laptop-l:w-full laptop:w-full tablet:w-full s:w-full flex justify-center my-44">
      {/* Display error message */}
      <div class="border-2 p-2 h-96 py-4 rounded-xl s:justify-center">
        <div class="mb-6 m:w-full s:w-full l:w-full">
          <h1 class="text-3xl font-semibold px-8 s:ml-12">Welcome Back</h1>
          <p class="s:ml-14">Login In to your Medium Account</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div class="mb-3 mx-2 s:mx-8">
            <p class="text-xl mb-3">Email:</p>
            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleChange}
              className="border-2 border-gray-100  w-[350px] s:w-[290px] mx-1 px-2 py-1 rounded-full"
              required
            />
          </div>
          <div class="mx-2 s:mx-8">
            <p class="text-xl mb-3">Password</p>
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              className="border-2 border-gray-100  w-[350px] s:w-[290px]  mx-1 px-2 py-1 mb-8 rounded-full"
              required
            />
          </div>
          <button type="submit" className="bg-black laptop-l:w-[310px] laptop:w-[310px] tablet:w-[310px] l:w-[350px] s:w-[290px] s:ml-8 py-1 mx-4 hover:bg-gray-600 rounded-full">
            <span class="text-gray-50">Log In</span>
          </button>
        </form>
      </div>
      {message && <p>{message}</p>}
    </div>
  </div>
  )
}

export default SignIn