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
const GetUsernameByUserID = require("./components/GetUsernameByUserID");

const app = express();
app.use(express.json());
app.use(cors("*"));

//initialize a simple http server
const server = http.createServer(app);
console.log("server:", server);

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
    console.log("MongoDB running");
  })
  .on("error", function (err) {
    console.log(err);
  });

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

app.post("/get-username-by-user-id", GetUsernameByUserID);

// original

// hashmap, key is room id, value is clients array
// this fixes
let chatRoomClients = {};

app.get("/get-current-room-client", (req, res) => {
  res.json(chatRoomClients);
});

wss.on("connection", (ws, req) => {
  // console.log(c);
  // console.log("c");
  // gets pathname
  let roomId = req.url.split("/")[1];
  let userId = req.url.split("/")[2];
  let clients = chatRoomClients[roomId] ? chatRoomClients[roomId] : [];
  ws.userId = userId;
  clients.push(ws);
  chatRoomClients[roomId] = clients;
  // console.log("url: ", req.url);
  // console.log("wss.clients:", wss.clients);
  // console.log(req.client);
  // console.log("req");
  // pathname

  chatRoomClients[roomId].forEach((client) =>
    console.log("chatRoomClients[roomId]: ", client.userId)
  );

  ws.on("close", function close() {
    chatRoomClients[roomId] = chatRoomClients[roomId].filter(
      (client) => client.userId !== userId
    );
    console.log("user id on closed target user Id", userId);

    if (chatRoomClients[roomId]) {
      chatRoomClients[roomId].forEach((client) =>
        console.log("remaining: ", client.userId)
      );
    }
    // console.log("req:", req)
  });

  // lyjBc36JbqNrSKq1l0UxSA==
  // ATsTMyC/0wiDsNSIxjktzA==

  // connection is up, let's add a simple simple event
  ws.on("message", (message) => {
    console.log("message received:", JSON.parse(message));
    // log the received message and send it back to the client
    let messageParse = JSON.parse(message);
    console.log("Received from Client:", messageParse);

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
          console.log("err:", err);
          return err;
        } else {
          console.log("Data Found in req.query.room:", data);

          Message.create(convertResData, function (err, newMessage) {
            if (err) throw err;
            console.log("newMessage", newMessage);
            Message.findById({ _id: newMessage._id }, function (err, data) {
              if (err) {
                console.log("err:", err);
              } else {
                // broadcast to clients
                // OG
                chatRoomClients[messageParse.room.toString()].forEach(
                  (client) => {
                    //   // console.log("current client:", client)
                    //   // OG
                    client.send(JSON.stringify(data));

                    //   if (client.readyState === WebSocket.OPEN) {
                    //     client.send(JSON.stringify(data));
                    // }

                    //   // if (client !== ws && client.readyState === WebSocket.OPEN) {
                    //   //   client.send(JSON.stringify(data));
                    //   // }
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
