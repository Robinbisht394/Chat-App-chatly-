import React from "react";
import {
  Box,
  Image,
  Text,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  useDisclosure,
  ModalOverlay,
  ModalHeader,
} from "@chakra-ui/react";
const UserProfileModal = (props) => {
  const { userProfileModal, user } = props;

  return (
    <>
      <Modal
        isOpen={userProfileModal.isOpen}
        onClose={userProfileModal.onClose}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>User Profile</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box textAlign="center">
              <Image
                src={user.pic}
                alt={user.name}
                borderRadius={"100%"}
                mx="auto"
                border={"2px solid red"}
                align={"center"}
                mb={"3px"}
              />
              <Text color={"grey.400"} fontWeight={"bold"} mb={"3px"}>
                {user.name}
              </Text>
              <Text>{user.email}</Text>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UserProfileModal;
