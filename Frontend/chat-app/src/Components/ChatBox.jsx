import { Box, Text } from "@chakra-ui/react";
import React from "react";
import { chatState } from "../context/chatProvider";
import SingleChat from "./miscellanous/SingleChat";
const ChatBox = () => {
  const { selectedchat } = chatState();
  return (
    <Box
      bg={"beige"}
      width={"60vw"}
      borderRadius={"5px"}
      padding={"4px"}
      height={"85vh"}
      d={{ base: selectedchat ? "flex" : "none", md: "flex" }}
      justifyContent={"center"}
      alignContent={"center"}
    >
      <SingleChat />
    </Box>
  );
};

export default ChatBox;
