
// // Exporting `UserContext` so it can be used to wrap components and provide context functionality.
import { useNavigate } from "react-router"; 
import { createContext, useState, useEffect } from "react"; 

// Create AccountContext to manage and provide user-related data
export const AccountContext = createContext(); 

const UserContext = ({ children }) => { 
  const [user, setUser] = useState({ loggedIn: null }); // Initialize user state
  const navigate = useNavigate(); // Hook to navigate programmatically

  useEffect(() => { 
    // Fetch user login status when the component mounts
    fetch("http://localhost:4000/auth/login", { 
      credentials: "include", // Include cookies for authentication
    })
      .catch(err => { 
        console.error("Error fetching login status:", err); 
        setUser({ loggedIn: false }); // Handle request failure
        return; 
      })
      .then(r => { 
        if (!r || !r.ok || r.status >= 400) { 
          setUser({ loggedIn: false }); // Handle invalid response
          return; 
        }
        return r.json(); // Parse the response if valid
      })
      .then(data => { 
        if (!data) { 
          setUser({ loggedIn: false }); // Handle empty or invalid data
          return; 
        }

        setUser({ ...data }); // Update the user state with received data
        navigate("/home");
      });
  }, []); // Runs only once after component mounts

  return (
    <AccountContext.Provider value={{ user, setUser }}> 
      {children} 
    </AccountContext.Provider>
  );
};

export default UserContext;
