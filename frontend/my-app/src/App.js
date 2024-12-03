import React,{useEffect,useState} from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import axios from 'axios';

const App = () => {
  const[data,setData]=useState(null)
  const[error,setError]=useState(null)
  useEffect(() => {
    const fetchData = async () => {
        try {
            const response = await axios.get("http://localhost:8000/");
            const { redis_data } = response.data;
            setData(redis_data); // Set data if no error
           } catch (error) {
            setError(error.message); // Use error.message to get a string error description
           }
    };
    fetchData();
  }, []);

  return (
    <div>
      <h1>FireBase Appps</h1>
      <p>Connect:{data}</p>
      <p>Error:{error}</p>
    </div>
  )
}

export default App