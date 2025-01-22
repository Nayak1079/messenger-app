import { useNavigate } from "react-router"; 
// Importing the `useNavigate` hook from "react-router" for navigation.

const { createContext, useState, useEffect } = require("react"); 
// Importing `createContext` for creating a context and `useState` and `useEffect` hooks for managing state and side effects.

export const AccountContext = createContext(); 
// Creating a context named `AccountContext` to manage and provide user-related data across components.

const UserContext = ({ children }) => { 
  // Defining the `UserContext` component that wraps its children with context provider.
  
  const [user, setUser] = useState({ loggedIn: null }); 
  // Initializing `user` state with a default object where `loggedIn` is `null`.

  const navigate = useNavigate(); 
  // Using `useNavigate` to programmatically navigate between routes.

  useEffect(() => { 
    // Using `useEffect` to perform side effects after the component mounts.

    fetch("http://localhost:4000/auth/login", { 
      credentials: "include", 
    }) 
    // Sending a GET request to the specified endpoint, including credentials (like cookies).

      .catch(err => { 
        setUser({ loggedIn: false }); 
        // If there's an error in the request, set `loggedIn` to `false` to indicate the user is not logged in.
        return; 
      })
      .then(r => { 
        if (!r || !r.ok || r.status >= 400) { 
          setUser({ loggedIn: false }); 
          // If the response is invalid or has an error status, set `loggedIn` to `false`.
          return; 
        }
        return r.json(); 
        // Parse the response JSON if the request is successful.
      })
      .then(data => { 
        if (!data) { 
          setUser({ loggedIn: false }); 
          // If the parsed data is invalid or empty, set `loggedIn` to `false`.
          return; 
        }
        setUser({ ...data }); 
        // Set the `user` state with the data received from the server.
        navigate("/home"); 
        // Navigate to the `/home` route after successful login.
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 
  // An empty dependency array ensures the effect runs only once after the component mounts.

  return (
    <AccountContext.Provider value={{ user, setUser }}> 
      {/* Providing the `user` state and `setUser` function to all child components wrapped by this context. */}
      {children} 
      {/* Rendering child components inside the provider. */}
    </AccountContext.Provider>
  );
};

export default UserContext; 
// Exporting `UserContext` so it can be used to wrap components and provide context functionality.
