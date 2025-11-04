import { Avatar, Tooltip, Box, Text, Flex } from "@chakra-ui/react";
import React from "react";
import ScrollableFeed from "react-scrollable-feed";
import { chatState } from "../../context/chatProvider";
import {
  isSameSender,
  isLastMessage,
  SameSenderMargin,
  // isSameUser,
} from "../../services/appLogic";

const ScrollabelFeedComponent = ({ messages }) => {
  const { user: authUser } = chatState();

  if (!authUser) return null;

  return (
    <ScrollableFeed>
      <Box p={2}>
        {messages &&
          messages.map((m, i) => {
            const isSentByMe = m.sender._id === authUser._id;

            return (
              <Flex
                key={m._id}
                mb={i === messages.length - 1 ? 0 : 2}
                justify={isSentByMe ? "flex-end" : "flex-start"}
              >
                {(isSameSender(messages, m, i, authUser._id) ||
                  isLastMessage(messages, i, authUser._id)) && (
                  <Tooltip
                    label={m.sender.name}
                    hasArrow
                    placement="bottom-start"
                    mr={1}
                  >
                    <Avatar
                      name={m.sender.name}
                      src={m.sender.pic}
                      size={"sm"}
                      cursor="pointer"
                      mt="5px"
                      ml={SameSenderMargin(messages, m, i, authUser._id)}
                    />
                  </Tooltip>
                )}

                {/* 2. Message Bubble */}
                <Box
                  maxWidth="75%"
                  borderRadius="lg"
                  px={4}
                  py={2}
                  ml={
                    !isSentByMe
                      ? SameSenderMargin(messages, m, i, authUser._id)
                      : 0
                  }
                  bg={isSentByMe ? "#005c4b" : "#2a3942"}
                  color="white"
                  fontWeight="medium"

                  // mt={isSameUser(messages, m, i) ? 1 : 4}
                  // Add extra margin for the last message in a sequence to align with avatar
                  // mb={isSameUser(messages, m, i) ? 1 : 0}
                >
                  {/* Display Sender Name in Group Chat */}
                  {m.chat.isGroupChat && !isSentByMe && (
                    <Text
                      fontSize="xs"
                      fontWeight="bold"
                      color="#00a884"
                      mb={1}
                    >
                      {m.sender.name}
                    </Text>
                  )}

                  {/* Message Content */}
                  <Text>{m.content} </Text>
                </Box>
              </Flex>
            );
          })}
      </Box>
    </ScrollableFeed>
  );
};

export default ScrollabelFeedComponent;
