import React from "react"; // Importing React
import { FriendContext } from "./Home"; // Importing FriendContext for accessing the friend list
import { useDisclosure } from "@chakra-ui/hooks"; // Importing Chakra UI's `useDisclosure` hook for modal handling
import { useContext } from "react"; // Importing `useContext` to access context values
import {
  Divider,
  Heading,
  HStack,
  VStack,
  Text,
  Circle,
} from "@chakra-ui/react"; // Importing layout and UI components from Chakra UI
import { Button } from "@chakra-ui/react"; // Importing Button component
import { ChatIcon } from "@chakra-ui/icons"; // Importing a ChatIcon for the button
import { TabList, Tab } from "@chakra-ui/react"; // Importing Tab components from Chakra UI
import AddFriendModal from "./AddFriendModal"; // Importing the AddFriendModal component for adding friends

const Sidebar = () => {
  // Accessing friendList (array of friends) from the FriendContext
  const { friendList } = useContext(FriendContext);

  // Using Chakra UI's useDisclosure hook for modal open/close logic
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      {/* Main container for the sidebar */}
      <VStack py="1.4rem">
        {/* Header section */}
        <HStack justify="space-evenly" w="100%">
          <Heading size="md">Add Friend</Heading>
          {/* Button to open the AddFriendModal */}
          <Button onClick={onOpen}>
            <ChatIcon />
          </Button>
        </HStack>
        {/* Divider for separating the header from the friend list */}
        <Divider />
        {/* List of friends, displayed as tabs */}
        <VStack as={TabList}>
          {/* Mapping over the friendList array */}
          {friendList.map((friend) => (
            <HStack as={Tab} key={`friend:${friend}`}>
              {/* Circle indicating online/offline status */}
              <Circle
                bg={friend.connected ? "green.700" : "red.500"} // Green for connected, red for offline
                w="20px" // Width of the circle
                h="20px" // Height of the circle
              />
              {/* Display the friend's name */}
              <Text>{friend.username}</Text>
            </HStack>
          ))}
        </VStack>
      </VStack>
      {/* AddFriendModal component, opened/closed using the `isOpen` and `onClose` values */}
      <AddFriendModal isOpen={isOpen} onClose={onClose} />
    </>
  );
};

export default Sidebar;
