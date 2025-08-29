const express = require("express");
const cookie = require("cookie-parser");
const cors = require("cors");
const { Socket } = require("socket.io");
const http = require("http");
const app = express();

const userRoutes = require("./Routes/UserRoutes");
const chatRoutes = require("./Routes/chatRoutes");
const messageRoutes = require("./Routes/messageRoutes");
const { dbConnection } = require("./Config/dbConnection");
const dotenv = require("dotenv");
dotenv.config();

// middleware
app.use(express.json());
app.use(cookie());
app.use(cors());
const server = http.createServer(app);
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);
const io = new Socket(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
  },
});

// establish a connection
io.on("connection", (socket) => {
  console.log("connected to soket.io");

  socket.on("setup", (userData) => {
    socket.join(userData._id);

    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("user joined room", room);
  });

  socket.on("new message", (newMessage) => {
    let chat = newMessage.chat;
    if (!chat.users) return;
    chat.users.forEach((user) => {
      if (user._id == newMessage.sender._id) return;
      socket.in(user._id).emit("message recieved", newMessage);
    });
  });

  socket.on("typing", (room) => {
    socket.in(room).emit("typing");
  });
  socket.on("stop typing", (room) => {
    socket.in(room).emit("stop typing");
  });
});

const serverStart = async () => {
  try {
    // connect database
    await dbConnection();
    console.log("data connecteed success");
    // listen to server
    server.listen(process.env.PORT || 4000, () => {
      console.log("server started");
    });
  } catch (error) {
    console.log(err);
  }
};

serverStart();
