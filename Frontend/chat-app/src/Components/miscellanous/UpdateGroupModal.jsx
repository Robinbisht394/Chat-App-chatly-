import React, { useState } from "react";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalHeader,
  ModalOverlay,
  ModalFooter,
  useDisclosure,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import UserListItem from "./UserListItem";
import { chatState } from "../../context/chatProvider";
import UserCard from "./UserCard";
import axios from "axios";

const UpdateGroupModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [renameGroup, setRenameGroup] = useState("");
  const [search, setSearch] = useState("");
  const [serachResults, setSearchResults] = useState("");
  const [loading, setloading] = useState("");
  const [renameLoading, setRenameLoading] = useState(false);
  const toast = useToast();
  const { user, selectedChat, setSelectedChat } = chatState();

  const handleRemove = async (userToRemove) => {
    if (selectedChat.groupAdmin._id != user._id) {
      toast({
        title: "members are not allowed to add",
        description: "Only group admin can add users",
        status: "warning",
        isClosable: true,
        duration: 3000,
      });
      return;
    }

    try {
      const config = {
        headers: {
          authorisation: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        "api/chat/dropuser",
        {
          chatId: selectedChat._id,
          userId: userToRemove._id,
        },
        config
      );
    } catch (err) {
      toast({
        title: "failed to remove",
        description: "failed to remove user to group",
        status: "error",
        isClosable: true,
        duration: 3000,
      });
    }
  };
  const handleRenameGroup = async () => {
    setRenameLoading(true);
    try {
      const { data } = await axios.put("api/chat/renamegroupchat", {
        chatId: selectedChat._id,
        chatName: renameGroup,
      });
      setRenameLoading(false);
    } catch (err) {
      toast({
        title: "failed to rename",
        description: "failed to change group name",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };
  const handleAddUser = async (userToAdd) => {
    if (selectedChat.users.find((user) => user._id == userToAdd._id)) {
      toast({
        title: "user Exist",
        description: "user already in group",
        status: "warning",
        isClosable: true,
        duration: 3000,
      });
      return;
    }
    if (selectedChat.groupAdmin._id != user._id) {
      toast({
        title: "Group Admin is allowed",
        description: "Only group admin can add users",
        status: "warning",
        isClosable: true,
        duration: 3000,
      });
      return;
    }

    try {
      const config = {
        headers: {
          authorisation: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        "api/chat/addusers",
        {
          chatId: selectedChat._id,
          userId: userToAdd._id,
        },
        config
      );
    } catch (err) {
      toast({
        title: "failed to add",
        description: "failed to add user to group",
        status: "error",
        isClosable: true,
        duration: 3000,
      });
    }
  };
  const handleSearch = async (e) => {
    //
    setSearch(e.target.value); // search val
    if (!search) {
      toast({
        title: "Empty search",
        description: "kindly fill serach",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }
    setloading(true);
    const response = await axios.get(
      `http://localhost:4000/api/user?=${search}`
    );
    setSearchResults(response.data);
  };
  const handleLeave = async () => {
    try {
      const config = {
        headers: {
          authorisation: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        "api/chat/dropuser",
        {
          chatId: selectedChat._id,
          userId: userToRemove._id,
        },
        config
      );
      toast({
        title: `${selectedChat.chatName} leaved successfully`,
        description: "failed to leave group",
        status: "error",
        isClosable: true,
        duration: 3000,
      });
      setSelectedChat("");
    } catch (err) {
      toast({
        title: "failed to leave",
        description: "failed to leave group",
        status: "error",
        isClosable: true,
        duration: 3000,
      });
    }
  };
  return (
    <div>
      <IconButton d={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />
      <Modal>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{selectedChat.chatName}</ModalHeader>
          <ModalCloseButton onClick={onClose} />
          <ModalBody>
            <Box display="flex" align-items="center" gap={2} padding={2}>
              {selectedChat.users.map((user) => {
                <UserListItem user={user} handleRemove={handleRemove} />;
              })}
            </Box>
            <Formcontrol marginBottom="4px">
              <Input
                type="text"
                placeholder="rename group"
                value={renameGroup}
                onChange={(e) => setRenameGroup(e.target.value)}
              />
              <Button onClick={handleRenameGroup} color-scheme="blue">
                {renameLoading ? <Spinner size={"sm"} /> : "Rename"}
              </Button>
            </Formcontrol>
            <Formcontrol>
              <input
                type="text"
                placeholder="add user to group"
                onChange={(e) => handleSearch(e.target.value)}
              />
            </Formcontrol>
            {serachResults?.map((user) => {
              <UserCard user={user} handlefunction={handleAddUser} />;
            })}
          </ModalBody>
          <ModalFooter>
            <Button onClick={handleLeave} color-scheme="red" color="white">
              Leave
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default UpdateGroupModal;
