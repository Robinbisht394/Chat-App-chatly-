import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerContent,
  DrawerOverlay,
  DrawerCloseButton,
  Box,
  Input,
  Button,
  VStack,
  Text,
  Spinner,
} from "@chakra-ui/react";
import UserCard from "./UserCard";
import SkeletonLoading from "../SkeletonLoading";
import { chatState } from "../../context/chatProvider";
import axios from "axios";
import { useState } from "react";
const Sidedrawer = (props) => {
  const { search, setSearch, result, handleSearch, isOpen, onClose, loading } =
    props;
  const { user, setSelectedChat, chatStateList, setChatStateList } =
    chatState();
  const [loadingChat, setloadingChat] = useState(false);
  const accessChat = async (userId) => {
    setloadingChat(true);
    const config = {
      headers: {
        authorization: `Bearer ${user.token}`,
      },
    };
    try {
      const { data } = await axios.post("/api/chat", { userId }, config);
      if (!chatStateList.find((c) => c._id === data._id))
        setChatStateList([data, ...chatStateList]);
      setSelectedChat(data);
      setloadingChat(false);
    } catch (err) {
      toast({
        title: "Error fetching chats",
        description: err.message,
        status: "error",
        duration: 3000,
      });
    }
  };
  return (
    <>
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Search users</DrawerHeader>
          <DrawerBody>
            <Box
              display={"flex"}
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <Input
                placeholder="search users"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch} marginLeft={"2px"}>
                Search
              </Button>
            </Box>
            <Box padding={"3px"} mt={"4px"}>
              <VStack>
                {loading && <SkeletonLoading />}
                {result?.map((user) => {
                  return (
                    <UserCard
                      username={user.name}
                      useremail={user.email}
                      profilePic={user.pic}
                      handleFunction={() => accessChat(user._id)}
                    />
                  );
                })}
              </VStack>
              {loadingChat && (
                <Spinner size={"sm"} placeSelf={"bottom-right"} />
              )}
            </Box>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default Sidedrawer;
