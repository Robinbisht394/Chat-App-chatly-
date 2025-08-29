import React from "react";
import { Box, IconButton } from "@chakra-ui/react";

import { FiX } from "react-icons/fi";
const UserListItem = ({ user, handleRemove }) => {
  return (
    <>
      <Box display={"flex"} gap={2} width={"auto"} padding={1}>
        <p>{user.name}</p>
        <IconButton
          aria-label="remove"
          icon={<FiX />}
          onClick={() => handleRemove(user)}
          variant="ghost"
          size="sm"
        />
      </Box>
    </>
  );
};

export default UserListItem;
