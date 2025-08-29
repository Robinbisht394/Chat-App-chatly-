import React, { useContext, useState } from "react";
import SideBar from "../Components/miscellanous/sideBar";
import { Box } from "@chakra-ui/react";
import { chatState } from "../context/chatProvider";
import UserChats from "../Components/UserChats";
import ChatBox from "../Components/ChatBox";

const chatPage = () => {
  console.log(chatState);

  return (
    <div style={{ background: "cyan", width: "100%", height: "100vh" }}>
      {<SideBar />}
      <Box display={"flex"} justifyContent={"space-between"} padding={"4px"}>
        {<UserChats />}
        {<ChatBox />}
      </Box>
    </div>
  );
};

export default chatPage;
