import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  VStack,
  Heading,
  InputGroup,
  useToast,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import useFetchApi from "../../customHooks/useFetch";

const Login = () => {
  const toast = useToast();
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();
  const { error, data, fetchApi } = useFetchApi();

  // data submit
  const onSubmit = async (formData) => {
    //  call the api
    await fetchApi("http://localhost:4000/api/user/login", formData);

    if (error?.response.data.code == "USER_NOT_FOUND") {
      toast({
        title: "Error",
        description: error.response.data.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } else if (error?.response.data.code == "INVALID ID_PASSWORD") {
      toast({
        title: "Error",
        description: error.response.data.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } else {
      localStorage.setItem("user", data.user);
      toast({
        title: "login successfull",
        description: data.message,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    }

    reset();
  };

  const [show, setShow] = useState(false);

  return (
    <Box padding="10px" paddingTop="14px" borderRadius="2px">
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* email field */}
        <VStack spacing={4}>
          <FormControl isInvalid={errors.email}>
            <FormLabel paddingLeft="2px" marginTop="2px" fontSize="15px">
              Email
            </FormLabel>
            <Input
              type="email"
              placeholder="enter email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Invalid email address",
                },
              })}
              variant="flushed"
              border={"1px solid grey"}
              borderColor="gray.300"
              borderRadius="3px"
              paddingLeft="1.9px"
              _invalid={{ borderColor: "gray.300", boxShadow: "none" }}
            />
            <FormErrorMessage paddingLeft="3px" margin="5px">
              {errors.email && errors?.email?.message}
            </FormErrorMessage>
          </FormControl>
          <FormControl
            paddingLeft="2px"
            marginTop="2px"
            fontSize="15px"
            isInvalid={errors.password}
          >
            <FormLabel paddingLeft="2px" marginTop="2px" fontSize="15px">
              password{" "}
            </FormLabel>
            <InputGroup
              display="flex"
              border={"1px solid grey"}
              borderColor="gray.300"
              padding="2px"
              borderRadius="3px"
              _focus={{ borderColor: "blue.500" }}
              _focusWithin={{
                borderColor: "blue.500",
                boxShadow: "0 0 0 1px blue.500",
              }}
            >
              <Input
                type={show ? "text" : "password"}
                placeholder="enter password"
                {...register("password", { required: "password is required" })}
                variant="flushed"
                _focus={{ boxShadow: "none", borderColor: "transaparent" }}
                _active={{ border: "none", outline: "none" }}
                paddingLeft="0px"
                border={"none"}
                _invalid={{ borderColor: "gray.300", boxShadow: "none" }}
              />

              <Button
                onClick={() => setShow((prev) => !prev)}
                variant={"ghost"}
                bg="none"
                _focus={{ boxShadow: "none", bg: "transparent" }}
                _hover={{ bg: "transaparent" }}
                _active={{ bg: "transaparent" }}
                width="auto"
                fontSize="10px"
                fontWeight="bold"
              >
                {show ? (
                  <AiOutlineEyeInvisible style={{ fontSize: "20px" }} />
                ) : (
                  <AiOutlineEye style={{ fontSize: "20px" }} />
                )}
              </Button>
            </InputGroup>
            <FormErrorMessage
              paddingLeft="4px"
              mt={1}
              fontSize={"sm"}
              color={"red.500"}
              visibility={errors.password ? "visible" : "hidden"}
            >
              {errors.password && errors.password?.message}
            </FormErrorMessage>
          </FormControl>
          {/* submit btn */}
          <Button
            type="submit"
            colorScheme="blue"
            width="full"
            marginTop="7px"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Logging" : "Login"}
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default Login;
