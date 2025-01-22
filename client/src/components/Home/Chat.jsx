import { Text, VStack } from "@chakra-ui/react";
import { TabPanel, TabPanels } from "@chakra-ui/react";
import { useContext } from "react";
import { FriendContext } from "./Home";
import { use } from "react";

const Chat = () => {
 const {friendList} =useContext(FriendContext);
  return friendList.length > 0 ? (
    <VStack>
      <TabPanels>
        <TabPanel>friend one</TabPanel>
        <TabPanel>friend two</TabPanel>
      </TabPanels>
    </VStack>
  ): (
    <VStack 
    justify="center"
    pt="5rem"
    w="100%"
    textAlign="center"
    fontSize="lg"
    >
      <TabPanels>
        <Text>No Friends :( click Add friend to start chat</Text>
      </TabPanels>
    </VStack>
  ) ;
};

export default Chat;