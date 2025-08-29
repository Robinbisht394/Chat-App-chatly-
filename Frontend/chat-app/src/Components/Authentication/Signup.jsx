import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Heading,
  VStack,
  useToast,
  HStack,
  Spinner,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

import axios from "axios";

const Signup = () => {
  const toast = useToast();
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImagefile] = useState(null);
  const [show, setShow] = useState(false);
  // const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();

  // upload image to cloudinary
  const uploadImageToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "chat app");
    formData.append("cloud_name", "duzaootux");

    // fetch the api to clodinary and send the data

    const response = await fetch(
      "https://api/.cloudinary.com/v1_1/duzaootux/image/upload",
      {
        method: "POST",
        body: formData,
      }
    );
    const data = response.json();
    return response.secure_url;
  };

  const onSubmit = async (data) => {
    try {
      let imageUrl = "";
      if (imageFile) {
        imageUrl = await uploadImageToCloudinary(imageFile);
      }
      const payload = {
        name: data.name,
        email: data.email,
        password: data.password,
        pic: imageUrl,
      };

      // send the data to signup api

      const response = await axios.post(
        "http://localhost:4000/api/user/signup",
        payload
      );

      // show a notification to user
      if (response) {
        toast({
          title: "Signup successfull",
          description: "User Registered ",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        localStorage.setItem("user", response.data.user);
        // navigate user to chatpage
        // Navigate("/chat");
      }

      // reset all the fields
      reset();
    } catch (err) {
      console.log(err);
      toast({
        title: "Signup failed",
        description: "An error ocuured",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      reset();
    }
  };

  // handle image change
  const handleImagechange = (e) => {
    console.log(e);
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      SetError("pic", {
        type: "manual",
        message: "only image file accepted",
      });
      return;
    }
    setImagefile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const password = watch("password");

  return (
    <Box maxW="md" mx="auto" mt={1} p={1}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack spacing={2}>
          {/* Name */}
          <FormControl isInvalid={errors.name}>
            <FormLabel>Name</FormLabel>
            <Input
              {...register("name", {
                required: "Name is required",
              })}
              placeholder="Enter your name"
              borderColor="gray.300"
              _invalid={{ borderColor: "gray.300", boxShadow: "none" }}
            />
            <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
          </FormControl>

          {/* Email */}
          <FormControl isInvalid={errors.email}>
            <FormLabel>Email</FormLabel>
            <Input
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Invalid email address",
                },
              })}
              placeholder="Enter your email"
              borderColor="gray.300"
              _invalid={{ borderColor: "gray.300", boxShadow: "none" }}
            />
            <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
          </FormControl>

          {/* Password */}
          <FormControl isInvalid={errors.password}>
            <FormLabel>Password</FormLabel>
            <HStack>
              <Input
                type={show ? "text" : "password"}
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
                placeholder="Enter your password"
                borderColor="gray.300"
                _invalid={{ borderColor: "gray.300", boxShadow: "none" }}
              />
              <Button
                onClick={() => setShow((prev) => !prev)}
                _focus={{ boxShadow: "none", bg: "transparent" }}
                boxShadow={"none"}
              >
                {show ? (
                  <AiOutlineEyeInvisible style={{ fontSize: "20px" }} />
                ) : (
                  <AiOutlineEye style={{ fontSize: "20px" }} />
                )}
              </Button>
            </HStack>
            <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
          </FormControl>

          <FormControl>
            <FormLabel>Set profile</FormLabel>
            <Input
              type="file"
              {...register("pic", {})}
              placeholder="upload a profile picture"
              borderColor="gray.300"
              onChange={handleImagechange}
            />
          </FormControl>

          <Button
            type="submit"
            colorScheme="blue"
            width="full"
            isDisabled={isSubmitting}
          >
            {isSubmitting ? <Spinner size={"sm"} /> : "Sign Up"}
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default Signup;
