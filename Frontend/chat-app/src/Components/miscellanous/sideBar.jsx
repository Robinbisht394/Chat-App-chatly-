import React, { useState } from "react";
import {
  Tooltip,
  Box,
  Button,
  Text,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Avatar,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { FaSearch } from "react-icons/fa";
import { FaBell } from "react-icons/fa";
import axios from "axios";
import Sidedrawer from "./SideDrawer";

import UserProfileModal from "../miscellanous/UserProfileModal";
import { chatState } from "../../context/chatProvider";
import { sender } from "../../config/appLogic";
const sideBar = () => {
  const { notification, setNotification, user, selectedChat, setSeletedchat } =
    chatState;
  const sideDrawer = useDisclosure();
  const userProfileModal = useDisclosure();
  const [search, setSearch] = useState("");
  const [loading, setloading] = useState(false);
  const [result, setResult] = useState([]);
  const toast = useToast();

  //user search
  const handleSearch = async () => {
    if (search == "") {
      toast({
        title: "Empty search",
        description: "kindly fill search",
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
    setResult(response.data);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        background: "beige",
        padding: "10px",
        borderRadius: "3px",
      }}
    >
      <Box>
        <Tooltip label="Search users here" aria-label="A tooltip" hasArrow>
          <Box
            display={"flex"}
            justifyContent={"center"}
            alignContent={"center"}
            onClick={sideDrawer.onOpen}
          >
            <FaSearch
              style={{
                marginTop: "14px",
                marginRight: "5px",
                textAlign: "center",
                placeSelf: "center",
              }}
            />
            <Button display={{ base: "none", md: "flex" }}>Search users</Button>
          </Box>
        </Tooltip>
      </Box>
      <Text fontWeight={"bold"}>Chattly app</Text>
      <Box
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
        gap={"10px"}
      >
        <Menu>
          <MenuButton>
            {notification.length && `${notification.length}`}
            <FaBell />
          </MenuButton>
          <MenuList>
            {!notification.length && "No new messages"}
            {notification.map((notif) => {
              <MenuItem
                onClick={() => {
                  setSeletedchat(notif.chat);
                  setNotification(
                    notification.filter((n) => {
                      n.chat._id != selectedChat._id;
                    })
                  );
                }}
              >
                {notif.chat.isGroupChat
                  ? `new message from ${notif.chat.chatName}`
                  : `new message from ${sender(user, notif.chat.users)}`}
              </MenuItem>;
            })}
          </MenuList>
        </Menu>
        <Menu>
          <MenuButton>
            <Avatar name={user.name} src={user.pic} />
          </MenuButton>
          <MenuList>
            <MenuItem onClick={userProfileModal.onOpen} role="button">
              My profile
            </MenuItem>
            <MenuItem
              onClick={
                () => localStorage.removeItem("user")
                // Navigate('/')
              }
            >
              Logout
            </MenuItem>
          </MenuList>
        </Menu>
        <Sidedrawer
          loading={loading}
          search={search}
          setSearch={setSearch}
          result={result}
          handleSearch={handleSearch}
          isOpen={sideDrawer.isOpen}
          onOpen={sideDrawer.onOpen}
          onClose={sideDrawer.onClose}
        />
        <UserProfileModal userProfileModal={userProfileModal} />
      </Box>
    </div>
  );
};

export default sideBar;
