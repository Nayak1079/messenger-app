import { AccountContext } from "./AccountContext"; 
// Importing `AccountContext` to access the user-related data provided by the context.

import { useContext } from "react"; 
// Importing `useContext` to consume the context data.

const { Outlet, Navigate } = require("react-router"); 
// Importing `Outlet` to render child routes and `Navigate` to redirect users.

const useAuth = () => { 
  // A custom hook to determine the user's authentication status.

  const { user } = useContext(AccountContext); 
  // Accessing the `user` object from the `AccountContext`.

  return user && user.loggedIn; 
  // Returns `true` if `user` exists and `loggedIn` is `true`, otherwise returns `false`.
};

const PrivateRoutes = () => { 
  // A component to manage access to private routes based on authentication.

  const isAuth = useAuth(); 
  // Using the `useAuth` hook to check if the user is authenticated.

  return isAuth ? <Outlet /> : <Navigate to="/" />; 
  // If authenticated, render the child route using `Outlet`.
  // Otherwise, redirect the user to the root ("/") using `Navigate`.
};

export default PrivateRoutes; 
// Exporting the `PrivateRoutes` component for use in route definitions.
