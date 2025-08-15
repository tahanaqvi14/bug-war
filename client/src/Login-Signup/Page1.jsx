import React from 'react'
import Signup from './Components/Singup'
import Login from './Components/Login'
import { Routes, Route } from 'react-router-dom';



const Page1 = () => {
  return (

    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>

  )
}

export default Page1
