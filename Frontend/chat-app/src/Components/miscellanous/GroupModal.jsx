import React, { useState } from "react";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Box,
  FormControl,
  Input,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import UserListItem from "./UserListItem";

import { chatState } from "../../context/chatProvider";

function GroupModal(props) {
  //   const { isOpen, onOpen, onClose } = useDisclosure();
  const { groupModalDisclosure } = props;
  const [groupchatName, setGroupchatName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState();
  const [serachResults, setSearchResults] = useState([]);
  const { chatStateList, setChatStateList } = chatState();
  const toast = useToast();

  // handle Submit
  const handleSubmit = async () => {
    if (!groupchatName || !selectedUsers) {
      toast({
        title: "User not selected",
        description: "group name & users not selected",
        status: "warning",
        duration: 3000,
      });
      return;
    }

    // make an API Call
    try {
      const config = {
        headers: {
          // authorisation: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post("api/chat/createGroup", {
        chatName: groupchatName,
        users: selectedUsers,
        config,
      });

      setChatStateList([data, ...chatStateList]);
      groupModalDisclosure.onClose();
    } catch (err) {
      toast({
        title: "Failed!",
        description: "failed to create group Chat",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleSearch = async (e) => {
    setSearch(e.target.value);

    try {
      const config = {
        headers: {
          authorisation: `bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`/api/users/?search=${search}`, config);
      setSearchResults(data);
    } catch (err) {
      toast({
        title: "failed to load users",
        description: "user fetching failed",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // handle user add to group

  const handleUserAdd = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      toast({
        title: "User Added",
        description: "user already added",
        status: "warning",
        isClosable: true,
        duration: 3000,
      });
    }
    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  // handle remove

  const handleRemoveUser = (user) => {
    setSelectedUsers(
      selectedUsers.filter((sel) => {
        return sel._id !== user.id;
      })
    );
  };
  return (
    <>
      <Modal
        isOpen={groupModalDisclosure.isOpen}
        onClose={groupModalDisclosure.onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Group chat</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box>
              <FormControl>
                <Input
                  type="text"
                  placeholder="chat Name"
                  onChange={(e) => setGroupchatName(e.target.value)}
                  mb={2}
                />
              </FormControl>
              <FormControl>
                <Input
                  type="text"
                  placeholder="chat Name"
                  onChange={(e) => handleSearch(e)}
                  mb={2}
                />
              </FormControl>
            </Box>
            <Box>{/* selcted chat users */}</Box>
            <Box d="flex" flexWrap={"wrap"}>
              {selectedUsers?.map((user) => {
                return (
                  <UserListItem user={user} handleRemove={handleRemoveUser} />
                );
              })}
            </Box>
            <Box>
              {serachResults?.slice(0, 4).map((user) => {
                <UserCard.jsx
                  user={user}
                  handleFunction={() => handleUserAdd(user)}
                />;
              })}
            </Box>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
              create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default GroupModal;
