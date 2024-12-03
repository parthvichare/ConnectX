import React,{useEffect,useState} from 'react'
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import axios from 'axios';

interface ApiResponse{
  message:string
}

const App = () => {
  const[data,setData]=useState<string | null>(null)
  const[error,setError]=useState<string | null>(null)
  useEffect(() => {
    const fetchData = async () => {
        try {
            const response = await axios.get<ApiResponse>("http://localhost:8000/api");
            const { message } = response.data;
            setData(message); // Set data if no error
           } catch (error) {
            if(error instanceof Error){
              setError(error.message); // Use error.message to get a string error description
            }else{
              setError("An Unknown Error Occured")
            }
           }
    };
    fetchData();
  }, []);

  return (
    <div>
      <h1>FireBase Ap</h1>
      <p>Connect:{data}</p>
      <p>Error:{error}</p>
    </div>
  )
}

export default App
