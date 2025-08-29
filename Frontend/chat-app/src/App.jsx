import { useState } from "react";
import "./App.css";

import ChatPage from "./pages/chatPage";
import { Box } from "@chakra-ui/react";
function App() {
  return (
    <>
      <Box width="100vw" height="100vh">
        <ChatPage />
      </Box>
    </>
  );
}

export default App;
