import React, { useEffect, useState } from "react";
import Login from "../Components/Authentication/Login";
import Signup from "../Components/Authentication/Signup";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Tab,
  Tabs,
  TabList,
  TabPanel,
  TabPanels,
  VStack,
  Container,
} from "@chakra-ui/react";
const Home = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  // const navigate = useNavigate();
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    if (user) {
      // navigate("/chats");
    }
  });
  return (
    <>
      <Container
        display="flex"
        width="100vw"
        height="100vh"
        justifyContent="center"
        alignItems="center"
        userSelect="none"
        overflowY={scroll}
        padding={20}
      >
        <Box>
          <Tabs
            isFitted={true}
            variant={"enclosed"}
            padding={"0px"}
            boxShadow={"md"}
          >
            <TabList>
              <Tab
                _selected={{
                  color: "white",
                  bg: "blue.300",
                  fontWeight: "bold",
                }}
              >
                Login
              </Tab>
              <Tab
                _selected={{
                  color: "white",
                  bg: "blue.300",
                  fontWeight: "bold",
                }}
              >
                Signup
              </Tab>
            </TabList>
            <VStack spacing={4}>
              <TabPanels>
                {/* login*/}
                <TabPanel>
                  <Login></Login>
                </TabPanel>
                {/* Signup */}
                <TabPanel>
                  <Signup></Signup>
                </TabPanel>
              </TabPanels>
            </VStack>
          </Tabs>
        </Box>
      </Container>
    </>
  );
};

export default Home;
