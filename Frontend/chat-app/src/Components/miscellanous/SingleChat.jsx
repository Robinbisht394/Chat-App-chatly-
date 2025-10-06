import React, { useEffect, useState } from "react";
import { chatState } from "../../context/chatProvider";
import { sender, fullSenderUserName } from "../../services/appLogic";
import UserProfileModal from "./UserProfileModal";
import {
  Box,
  Icon,
  Text,
  useDisclosure,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import { FaArrowLeft } from "react-icons/fa";
import UpdateGroupModal from "./UpdateGroupModal";
import ScrollabelFeed from "./ScrollabelFeed";
import io from "socket.io-client";
const endpoint = "http://localhost:4000";
let socket, selectedChatCompare;
const SingleChat = () => {
  const { user, selectedChat, setSelectedChat, notification, setNotification } =
    chatState();
  const userProfileModal = useDisclosure();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketconnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const toast = useToast();
  const sendMessage = async (e) => {
    try {
      const config = {
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.post(
        "api/message",
        {
          content: newMessage,
          chatId: selectedChat._id,
        },
        config
      );
      setNewMessage("");

      socket.emit("new message", data);
    } catch (err) {
      toast({
        title: "error occured",
        description: "message not sent",
        isClosable: true,
        duration: 2000,
      });
    }
  };

  useEffect(() => {
    const fetchMessage = async (e) => {
      try {
        setLoading(true);
        const config = {
          headers: {
            authorization: `Bearer ${token}`,
          },
        };
        const { data } = await axios.get("api/message", {
          chatId: selectedChat._id,
        });
        setMessages(data);
        setLoading(false);
        socket.emit("join chat", selectedChat._id);
      } catch (err) {
        setLoading(false);
        toast({
          title: "error occured",
          description: "messages failed load",
          isClosable: true,
          duration: 2000,
        });
      }
    };

    fetchMessage();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message recieved", (newMessage) => {
      if (!selectedChat || selectedChatCompare._id == newMessage.chat._id) {
        // notification
        if (!notification.includes(newMessage)) return;
        setNotification(newMessage, ...notification);
      } else {
        setMessages([...messages, newMessage]);
      }
    });
  });

  useEffect(() => {
    socket = io(endpoint);
    socket.emit("setup", user);
    socket.on("connection", () => {
      setSocketconnected(true);
    });
  }, []);

  const typingIndicator = (e) => {
    setNewMessage(e.target.value);

    setIsTyping(true);
  };
  return (
    <>
      {selectedChat ? (
        <>
          <Text>
            {
              <Icon
                as={FaArrowLeft}
                size={"sm"}
                onClick={() => setSelectedChat("")}
              />
            }
            {selectedChat.isGroupChat
              ? selectedChat.chatName
              : sender(user, selectedChat.users)}

            {!selectedChat.isGroupChat ? (
              <>
                <UserProfileModal
                  userProfileModal={userProfileModal}
                  user={fullSenderUserName(user, selectedChat.users)}
                />
              </>
            ) : (
              <>
                <UpdateGroupModal />
              </>
            )}
          </Text>
          {loading ? (
            <Spinner size="md" />
          ) : (
            <div>{<ScrollabelFeed messages={messages} />}</div>
          )}
          <FormControl onkeyDown={sendMessage}>
            <Input
              type="text"
              placeholder="enter message here.. "
              onChange={typingIndicator}
            />
          </FormControl>
        </>
      ) : (
        <Box d="flex" justifyContent={"center"} alignItems={"center"}>
          <Text>select chat to start </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
