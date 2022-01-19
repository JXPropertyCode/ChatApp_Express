// Mongoose Connection
const mongoose = require("mongoose");
require("dotenv").config();
const Schema = mongoose.Schema;

const express = require("express");
const cors = require("cors");
const http = require("http");
const WebSocket = require("ws");
const Message = require("./models/MessageObject");
const Account = require("./models/AccountObject");
const Chatroom = require("./models/ChatroomObject");
// const { findOne } = require("./models/MessageObject");

// const emailController = require("./components/Email/Controller");

// functions that I use
const Messages = require("./components/Messages");
const Chatrooms = require("./components/Chatrooms");
const Users = require("./components/Users");
const Signup = require("./components/Signup");
const LoginValidation = require("./components/LoginValidation");
const UserChatroomValidation = require("./components/UserChatroomValidation");
const GetUserChatroom = require("./components/GetUserChatroom");
const VerifyAuthToAddUsersToChatroom = require("./components/VerifyAuthToAddUsersToChatroom");
const AddUsersToChatroom = require("./components/AddUsersToChatroom");
const CreateChatroom = require("./components/CreateChatroom");
const GetChatroomMembers = require("./components/GetChatroomMembers");
const LeaveChatroom = require("./components/LeaveChatroom");
const ChangeUsername = require("./components/ChangeUsername");
const GetUsernameByUserId = require("./components/GetUsernameByUserId");
// const ChangeEmail = require("./components/ChangeEmail");

const app = express();
app.use(express.json());
app.use(cors("*"));

//initialize a simple http server
const server = http.createServer(app);
// console.log("server:", server);

//initialize the WebSocket server instance
// OG
const wss = new WebSocket.Server({ server: server });
// console.log("wss:", wss)

const url = process.env.MONGODB_URL;

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// check for DB connection
mongoose.connection
  .once("open", function () {
    // console.log("MongoDB running");
  })
  .on("error", function (err) {
    // console.log(err);
  });

// This is the endpoint that is hit from the onSubmit handler in Landing.js
// The callback is shelled off to a controller file to keep this file light.
// app.post("/email", emailController.collectEmail);

// Same as above, but this is the endpoint pinged in the componentDidMount of
// Confirm.js on the client.
// app.post("/confirm/:id", emailController.confirmEmail);

// app.post("/change-email/:id", emailController.changeEmail);

// app.post("/confirm-change-email/:id", emailController.confirmChangeEmail);

// app.post("/change-password/:id", emailController.changePassword);

// app.post("/confirm-change-password/:id", emailController.confirmChangePassword);

app.get("/", (req, res) => {
  // server health check on the localhost port
  res.send("200 OK");
});

app.get("/messages", Messages);

app.get("/chatrooms", Chatrooms);

app.get("/users", Users);

app.get("/signup", (req, res) => {
  res.send("200 OK");
});

app.post("/signup", Signup);

app.get("/login-validation", (req, res) => {
  res.send("200 OK");
});

app.post("/login-validation", LoginValidation);

app.get("/user-chatroom-validation", (req, res) => {
  res.send("200 OK");
});

app.post("/user-chatroom-validation", UserChatroomValidation);

app.get("/get-user-chatroom", (req, res) => {
  res.send("200 OK");
});

app.post("/get-user-chatroom", GetUserChatroom);

app.get("/verify-auth-to-add-users-to-chatroom", (req, res) => {
  res.send("200 OK");
});

app.post(
  "/verify-auth-to-add-users-to-chatroom",
  VerifyAuthToAddUsersToChatroom
);

app.get("/add-users-to-chatroom", (req, res) => {
  res.send("200 OK");
});

// PROBLEM WITH ASYNC when using Callbacks
app.post("/add-users-to-chatroom", AddUsersToChatroom);

app.get("/create-chatroom", (req, res) => {
  res.send("200 OK");
});

app.post("/create-chatroom", CreateChatroom);

app.get("/get-chatroom-members", (req, res) => {
  res.send("200 OK");
});

app.post("/get-chatroom-members", GetChatroomMembers);

app.get("/leave-chatroom", (req, res) => {
  res.send("200 OK");
});

app.post("/leave-chatroom", LeaveChatroom);

app.post("/change-username", ChangeUsername);

app.post("/get-username-by-user-id", GetUsernameByUserId);

// hashmap, key is room id, value is clients array. Keeps tracks of the speicifc clients in the room/ws
// this fixes duplicating instances of connections. Where a user can connect many times and it would have it in its memory
// everytime the user joins, it is differentialed by its userId from accountCollection
// it would remove or add depending on who has connected
let chatroomClients = {};

// this simply checks what is inside the chatroomClients object
// note: it would duplicate a connection at least 2 times due to maybe React's re-renderings
app.get("/get-current-room-client", (req, res) => {
  res.json(chatroomClients);
});

wss.on("connection", (ws, req) => {
  // req.url gets path, this would allow ws to broadcast ONLY to the clients in its chatroomClients array.
  let roomId = req.url.split("/")[1];
  let userId = req.url.split("/")[2];

  // if the chatRoomClient doesn't have an array, it would add it
  let clients = chatroomClients[roomId] ? chatroomClients[roomId] : [];

  // ws is now given an key and value
  ws.userId = userId;

  // clients, aka the array, would push the new client that has joined the room
  clients.push(ws);

  // update teh chatRoomClient's array with the newly added user array
  chatroomClients[roomId] = clients;

  chatroomClients[roomId].forEach(
    (client) =>
      // console.log("chatroomClients[roomId]: ", client.userId)
      client
  );

  ws.on("close", function close() {
    // on close, aka disconnect, the chatRoomClient would filter that specific userId from the array
    chatroomClients[roomId] = chatroomClients[roomId].filter(
      (client) => client.userId !== userId
    );
    // console.log("user id on closed target user Id", userId);

    // outputs the remaining clients in the ws connection
    if (chatroomClients[roomId]) {
      chatroomClients[roomId].forEach(
        (client) =>
          // console.log("remaining: ", client.userId)
          client
      );
    }
  });

  // connection is up, let's add a simple simple event
  ws.on("message", (message) => {
    // console.log("message received:", JSON.parse(message));
    // log the received message and send it back to the client
    let messageParse = JSON.parse(message);
    // console.log("Received from Client:", messageParse);

    // validated username and password
    let convertResData = new Message({
      room: messageParse.room.toString(),
      owner: messageParse.owner.toString(),
      username: messageParse.username.toString(),
      email: messageParse.email.toString(),
      password: messageParse.password.toString(),
      // lastModified: Number(messageParse.lastModified),
      clientMessage: messageParse.clientMessage.toString(),
    });

    // this is for seeing if the message being sent is authentic and valid. Haven't tested this to see if its true
    Account.find(
      {
        _id: convertResData.owner,
        email: convertResData.email,
        password: convertResData.password,
      },
      function (err, data) {
        if (err) {
          // console.log("err:", err);
          return err;
        } else {
          // console.log("Data Found in req.query.room:", data);

          Message.create(convertResData, function (err, newMessage) {
            if (err) throw err;
            // console.log("newMessage", newMessage);
            Message.findById({ _id: newMessage._id }, function (err, data) {
              if (err) {
                // console.log("err:", err);
              } else {
                // broadcast to clients in teh chatroomClients
                chatroomClients[messageParse.room.toString()].forEach(
                  (client) => {
                    client.send(JSON.stringify(data));
                  }
                );
              }
            }).populate("owner");
          });
        }
      }
    );
  });
});

//start our server
server.listen(process.env.PORT || 8000, () => {
  console.log(`Server started on port ${server.address().port} :)`);
});
