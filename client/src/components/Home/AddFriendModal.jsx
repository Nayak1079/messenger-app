import {
    Modal,
    ModalContent,
    ModalCloseButton,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Heading,
    ModalOverlay,
    Button,
  } from "@chakra-ui/react"; // Chakra UI components for styling
  import TextField from "../TextField"; // Custom TextField component for form input
  import * as Yup from "yup"; // Library for schema validation
  import socket from "../../socket"; // Socket instance for real-time communication
  import { useState, useCallback, useContext } from "react"; // React hooks
  import { FriendContext } from "./Home"; // Context to manage the friend list globally
  import { Form, Formik } from "formik"; // Formik for form management
  
  // Component to render a modal for adding a new friend
  const AddFriendModal = ({ isOpen, onClose }) => {
    // State to track error messages from the server or validation
    const [error, setError] = useState("");
  
    // Function to close the modal and reset the error state
    const closeModal = useCallback(() => {
      setError(""); // Clear any previous error message
      onClose(); // Call the onClose function passed as a prop
    }, [onClose]);
  
    // Accessing the setFriendList function from the FriendContext to update the friend list
    const { setFriendList } = useContext(FriendContext);
  
    return (
      // Modal component from Chakra UI, controlled via `isOpen` and `onClose`
      <Modal isOpen={isOpen} onClose={closeModal}>
        <ModalOverlay /> {/* Provides a background overlay for the modal */}
        <ModalContent>
          <ModalHeader>Add a friend!</ModalHeader> {/* Modal header */}
          <ModalCloseButton /> {/* Close button for the modal */}
  
          {/* Formik for handling form state and submission */}
          <Formik
            initialValues={{ friendName: "" }} // Initial state for the form input
            onSubmit={values => {
              // Called when the form is submitted
              socket.emit(
                "add_friend", // Emit an "add_friend" event to the server
                values.friendName, // Send the friend's username as data
                ({ errorMsg, done, newFriend }) => {
                  // Callback to handle the server's response
                  if (done) {
                    // If the friend is successfully added
                    // setFriendList(c => [values.friendName, ...c]); // Update the friend list in context
                    setFriendList(c => [newFriend, ...c]);
                    closeModal(); // Close the modal
                    return;
                  }
                  setError(errorMsg); // Set the error message if adding the friend fails
                }
              );
            }}
            validationSchema={Yup.object({
              // Validation schema for the form
              friendName: Yup.string()
                .required("Username required") // Ensure the field is not empty
                .min(6, "Invalid username!") // Minimum length of 6 characters
                .max(28, "Invalid username!"), // Maximum length of 28 characters
            })}
          >
            {/*
              Form component to render the form fields and handle submission
            */}
            <Form>
              <ModalBody>
                {/* Display error message (if any) */}
                <Heading fontSize="xl" color="red.500" textAlign="center">
                  {error}
                </Heading>
                {/* Custom TextField for the friend's name input */}
                <TextField
                  label="Friend's name"
                  placeholder="Enter friend's username.."
                  autoComplete="off" // Disable autocomplete for better UX
                  name="friendName" // Field name for Formik to manage
                />
              </ModalBody>
              <ModalFooter>
                {/* Submit button to trigger form submission */}
                <Button colorScheme="blue" type="submit">
                  Submit
                </Button>
              </ModalFooter>
            </Form>
          </Formik>
        </ModalContent>
      </Modal>
    );
  };
  
  export default AddFriendModal; // Export the component
  