import React, { useState, useEffect } from "react";
import { createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";

const chatContext = createContext();

const ChatProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [selectedChat, setSeletedchat] = useState();
  const [chatStateList, setChatStateList] = useState();
  const [notification, setNotification] = useState([]);
  // const navigate = useNavigate();
  console.log(user);

  useEffect(() => {
    const user = localStorage.getItem("user");

    if (!user) {
      // navigate("/login");
    }
    setUser(user);
  });
  return (
    <chatContext.Provider
      value={{
        user,
        setUser,
        selectedChat,
        setSeletedchat,
        chatStateList,
        setChatStateList,
        notification,
        setNotification,
      }}
    >
      {children}
    </chatContext.Provider>
  );
};
export const chatState = () => {
  return useContext(chatContext);
};
export default ChatProvider;
