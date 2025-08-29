import React from "react";
import { Card, CardBody, Heading, Text, Avatar } from "@chakra-ui/react";
const UserCard = (props) => {
  const { user, handleFunction } = props;
  return (
    <Card
      display={"flex"}
      alignItems={"center"}
      width={"100%"}
      flexDirection={"row"}
      mb={"3px"}
      padding={"4px"}
      onClick={() => handleFunction(user)}
    >
      <Avatar size={"sm"} src={user.pic} name={user.name} />

      <CardBody>
        <Heading fontSize={"13px"}>{user.name}</Heading>
        <Text fontSize={"8px"}>{user.email}</Text>
      </CardBody>
    </Card>
  );
};

export default UserCard;
