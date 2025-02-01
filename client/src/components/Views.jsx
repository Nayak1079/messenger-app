import { Text } from "@chakra-ui/react";
import { useContext } from "react";
import { Route, Routes } from "react-router-dom";
import { AccountContext } from "./AccountContext";
import Login from "./Auth/Login";
import SignUp from "./Auth/SignUp";
import PrivateRoutes from "./PrivateRoutes";
import Home from "./Home/Home";
const Views = () => {
  const { user } = useContext(AccountContext);
  return user.loggedIn === null ? (
    <Text>Loading...</Text>
  ) : (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<SignUp />} />
      <Route element={<PrivateRoutes />}>
        <Route path="/home" element={<Home/>} />
      </Route>
      <Route path="*" element={<Login />} />
    </Routes>
  );
};

export default Views;
// import React from 'react';
// import { Route, Routes, Navigate } from 'react-router-dom';
// import SignUp from './Auth/SignUp';
// import Login from './Auth/Login';
// import { Text } from '@chakra-ui/react';
// import PrivateRoutes from './PrivateRoutes';

// const Views = () => {
//   return (
//     <Routes>
//       {/* Public Routes */}
//       <Route path="/" element={<Login />} />
//       <Route path="/register" element={<SignUp />} />

//       {/* Protected Routes */}
//       <Route element={<PrivateRoutes />}>
//         <Route path="/home" element={<Text>Hi, welcome Home</Text>} />
//       </Route>

//       {/* Fallback Route */}
//       <Route path="*" element={<Navigate to="/" />} />
//     </Routes>
//   );
// };

// export default Views;

