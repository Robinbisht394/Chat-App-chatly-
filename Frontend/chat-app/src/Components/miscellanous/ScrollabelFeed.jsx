import { Avatar, Tooltip } from "@chakra-ui/react";
import React from "react";
import { chatState } from "../../context/chatProvider";
import { isSameSender, SameSenderMargin } from "../../services/appLogic";
const ScrollabelFeed = ({ messages }) => {
  const { user } = chatState;
  return (
    <ScrollabelFeed>
      {messages &&
        messages.map((m, i) => {
          <div>
            {isSameSender(messages, m, i, user._id) ||
              (isLastMessage(messages, i, user._id) && (
                <Tooltip
                  label={m.sender.name}
                  hasArrow
                  placement="bottom-start"
                >
                  <Avatar name={m.sender.name} src={m.sender.pic} size={"sm"} />
                </Tooltip>
              ))}
            <span
              style={{
                background: m.sender._id != user._id ? "green" : "blue",
                marginLeft: SameSenderMargin(messages, m, i, user._id),
              }}
            >
              {m.sender.content}
            </span>
          </div>;
        })}
    </ScrollabelFeed>
  );
};

export default ScrollabelFeed;
