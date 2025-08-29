import React, { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Button,
  Text,
  useToast,
  Stack,
  useDisclosure,
} from "@chakra-ui/react";
import { chatState } from "../context/chatProvider";
import SkeletonLoading from "./SkeletonLoading";
import { sender } from "../config/appLogic";
import GroupModal from "./miscellanous/GroupModal";
const UserChats = () => {
  const [loggedUser, setLoggedUser] = useState();
  const {
    user,
    selectedChat,
    setSeletedchat,
    chatStateList,
    setChatStateList,
  } = chatState;
  const groupModalDisclosure = useDisclosure();
  const toast = useToast();
  const fetchUserChats = async () => {
    try {
      const config = {
        headers: {
          authorisation: `bearer ${user.token}`,
        },
      };

      const { data } = axios.get("http://localhost:4000/api/chats", config);
      setChatStateList(data);
    } catch (err) {
      toast({
        title: "something went occured",
        description: "failed to load chats",
        status: "error",
        duration: 3000,
      });
    }
  };
  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("user")));
    fetchUserChats();
  }, []);
  return (
    <>
      <Box
        display={{ base: !selectedChat ? "flex" : "none", md: "flex" }}
        border={"2px solid white"}
        justifyContent={"space-between"}
        padding={"4px"}
        width={"35vw"}
        height={"85vh"}
        bg={"beige"}
        borderRadius={"5px"}
      >
        <Box
          display={"flex"}
          padding={"2px"}
          width={"100%"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <Heading fontSize={"20px"}>My Chats</Heading>

          <Button
            bg={"grey.400"}
            color={"white"}
            padding={"2px"}
            textAlign={"center"}
            onClick={groupModalDisclosure.onOpen}
          >
            group Chat +
          </Button>
          <GroupModal groupModalDisclosure={groupModalDisclosure} />
        </Box>
        {/* user chats */}
        <Box
          display={"flex"}
          justifyContent={"space-between"}
          alignItems={"center"}
          flexDirection={"column"}
        >
          {chats ? (
            <Stack overflowY={"scroll"}>
              {chatStateList.map((chat) => {
                return (
                  <Box
                    onClick={setSeletedchat(chat)}
                    cursor={"pointer"}
                    bg={selectedChat == chat ? "green" : ""}
                    color={selectedChat == chat ? "white" : "black"}
                    key={chat._id}
                  >
                    <Text>
                      {!chat.isgroupChat
                        ? sender(loggedUser, chat.users)
                        : chat.chatName}
                    </Text>
                  </Box>
                );
              })}
            </Stack>
          ) : (
            <SkeletonLoading />
          )}
        </Box>
      </Box>
    </>
  );
};

export default UserChats;
