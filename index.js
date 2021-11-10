// Mongoose Connection
const mongoose = require("mongoose");
require("dotenv").config();

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
const Signup = require("./components/Signup");
const LoginValidation = require("./components/LoginValidation");
const UserChatroomValidation = require("./components/UserChatroomValidation");
const GetUserChatroom = require("./components/GetUserChatroom");
const VerifyAuthToAddUsersToChatroom = require("./components/VerifyAuthToAddUsersToChatroom");
const AddUsersToChatroom = require("./components/AddUsersToChatroom");
const CreateChatroom = require("./components/CreateChatroom");

const app = express();
app.use(express.json());
app.use(cors("*"));

//initialize a simple http server
const server = http.createServer(app);

//initialize the WebSocket server instance
const wss = new WebSocket.Server({ server });

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

// PROBLEM WITH ASYNC
app.post("/add-users-to-chatroom", AddUsersToChatroom);

app.get("/create-chatroom", (req, res) => {
	res.send("200 OK");
});

app.post("/create-chatroom", CreateChatroom);

wss.on("connection", (ws) => {
	// console.log(wss.clients)
	//connection is up, let's add a simple simple event
	ws.on("message", (message) => {
		// log the received message and send it back to the client
		let messageParse = JSON.parse(message);
		console.log("Received from Client:", messageParse);

		// validated username and password
		let convertResData = {
			roomID: messageParse.roomID.toString(),
			userID: messageParse.userID.toString(),
			username: messageParse.username.toString(),
			email: messageParse.email.toString(),
			password: messageParse.password.toString(),
			timestamp: Number(messageParse.timestamp),
			clientMessage: messageParse.clientMessage.toString(),
		};

		Message.create(convertResData, function (err) {
			if (err) throw err;
		});

		console.log("Message Sent to Client:", convertResData);

		// chatroom findOne(roomid)
		// chatroom.memeer.foreatch(client) => {

		// }

		// broadcast to clients
		wss.clients.forEach((client) => {
			console.log("Client:", client);
			client.send(JSON.stringify(convertResData));
		});
	});

	//send immediatly a feedback to the incoming connection
	// ws.send("Hi there, I am a WebSocket server");
});

//start our server
server.listen(process.env.PORT || 8000, () => {
	console.log(`Server started on port ${server.address().port} :)`);
});
