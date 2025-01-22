import React  from 'react'
import {FriendContext} from './Home'
import { useDisclosure } from "@chakra-ui/hooks";
import { useContext } from 'react'
import {Divider,Heading,HStack,VStack,Text,Circle} from '@chakra-ui/react'
import{Button} from "@chakra-ui/react";
import {ChatIcon} from "@chakra-ui/icons"
import { TabList, Tab } from "@chakra-ui/react";
import AddFriendModal from './AddFriendModal';
const Sidebar = () => {
  const {friendList,setFriendList}=useContext(FriendContext); 
  const {isOpen,onOpen,onClose}=useDisclosure(); 
  return (
    <>
   <VStack py="1.4rem">
   <HStack justify="space-evenly" w="100%">
    <Heading size="md">Add Friend</Heading>
   <Button onClick={onOpen} >
     <ChatIcon/>
   </Button>
   </HStack>
   <Divider/>
   <VStack as={TabList}>
    {friendList.map(friend => (
      <HStack as={Tab}>
     <Circle 
     bg={friend.connected ? "green.700" : "red.500" }
      w="20px"
      h="20px"
      />
      <Text>{friend.username}</Text>
      </HStack>
    ))}
    </VStack>
  </VStack>
  <AddFriendModal isOpen={isOpen} onClose={onClose}/>
  </>
  );
}

export default Sidebar;
