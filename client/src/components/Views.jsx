import React from 'react'
import {Route, Routes} from "react-router-dom";
import SignUp from "./Auth/SignUp";
import Login from "./Auth/Login";



const views = () => {
  return (
    <Routes>
    <Route path="/" element= {<Login />}></Route>
    <Route path="/register" element={<SignUp />}></Route>
    <Route path="*" element={<Login/>}/>
    </Routes>
  )
}

export default views;
