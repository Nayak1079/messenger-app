import { Grid, GridItem, Tabs } from '@chakra-ui/react'; // Import Chakra UI components for layout and styling
import React, { createContext, useState } from 'react'; // Import React for component creation and state management
import Sidebar from './Sidebar'; // Import the Sidebar component
import Chat from './Chat'; // Import the Chat component
import useSocketSetup from './useSocketSetup'; // Import the custom hook for socket connection setup

// Create a context to manage the friend list across components
export const FriendContext = createContext();
export const MessageContext = createContext();
const Home = () => {
  // State to manage the list of friends
  const [friendList, setFriendList] = useState([]);
  const [messages, setMessages] = useState([]);
  const [friendIndex,setFriendIndex] = useState(0);
  // Call the custom hook to set up socket connections and event handling
  useSocketSetup(setFriendList,setMessages);

  return (
    // Provide the friend list and setter function to child components via the FriendContext
    <FriendContext.Provider value={{ friendList, setFriendList }}>
      {/* Use Chakra UI Grid for layout */}
      <Grid
        templateColumns="repeat(10, 1fr)"
        h="100vh"
        as={Tabs}
        onChange={index => setFriendIndex(index)}
      >
        {/* Sidebar takes up 2/10th of the width and has a right border */}
        <GridItem colSpan="2" borderRight="1px solid gray">
          <Sidebar />
        </GridItem>
        {/* Chat takes up the remaining 7/10th of the width */}
        <GridItem colSpan="7" maxH="100vh">
          <MessageContext.Provider value={{ messages, setMessages }}>
            <Chat userid={friendList[friendIndex]?.userid} />
          </MessageContext.Provider>

        </GridItem>
      </Grid>
    </FriendContext.Provider>
  );
};

export default Home;
