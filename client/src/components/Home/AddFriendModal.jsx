import { Modal, ModalContent,ModalCloseButton, ModalHeader,ModalBody, ModalFooter } from "@chakra-ui/react"
import {Button,ModalOverlay} from "@chakra-ui/react";
import TextField from "../TextField";
import { Formik } from "formik";
import * as Yup from "yup";
const AddFriendModal = ({isOpen,onClose}) => {
   return(
   <Modal isOpen={isOpen} onClose={onClose} isCentered>
    <ModalOverlay/>
    <ModalContent>
        <ModalHeader>Add a friend!</ModalHeader>
        <ModalCloseButton/>
     <Formik initial initialValues={{friendName:""}}
       onSubmit={(values) => {alert(JSON.stringify(values,null,2));
       onClose();}}
        validationSchema={Yup.object({
            friendName: Yup.string()
            .required("Username required")
            .min(6, "Invalid username!")
            .max(28, "Invalid username!"),
        })}>
        <form>
        <ModalBody>
            <TextField label="Friend's name" placeholder="Enter friend's username.." 
            autocomplete="off"
            name="friendName"/>
        </ModalBody>
        <ModalFooter>
            <Button colorScheme='blue'  type="submit">
                Submit
            </Button>
        </ModalFooter>
        </form>
        </Formik>
    </ModalContent>
   </Modal>
   );  
 }

 export default AddFriendModal;
 