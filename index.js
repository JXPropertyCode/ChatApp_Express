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
const LoginValidation = require('./components/LoginValidation')
const UserChatroomValidation = require('./components/UserChatroomValidation')
const GetUserChatroom = require('./components/GetUserChatroom')
const VerifyAuthToAddUsersToChatroom = require('./components/VerifyAuthToAddUsersToChatroom')
const CreateChatroom = require('./components/CreateChatroom')


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

app.post("/verify-auth-to-add-users-to-chatroom", VerifyAuthToAddUsersToChatroom);

app.get("/add-users-to-chatroom", (req, res) => {
	res.send("200 OK");
});

// PROBLEM WITH ASYNC 
// app.post("/add-users-to-chatroom", (req, res) => {
// 	console.log("Inside Add Users to Chatroom...");
// 	let reqData = req.body;

// 	console.log("reqData:", reqData);

// 	// finding the userId to add the user to the chatroom

// 	let memberStatus = {
// 		addedMembers: [],
// 		notAddedMembers: [],
// 	};

// 	async function filterMembers() {
// 		await reqData.addMembersList.forEach( async (members) => {
// 			console.log("Members:", members);
// 			try {
// 				Account.find({ _id: members }, function (err, data) {
// 					if (err) {
// 						console.log(err);
// 						res.send({ errorMessage: "This isn't a valid input." });
// 						return err;
// 					}

// 					// console.log("data[0]:", data[0]);

// 					if (data.length === 1) {
// 						// res.send({
// 						// 	validCred: "true",
// 						// });
// 						console.log("Account Found:", data[0]);

// 						memberStatus.addedMembers = [
// 							...memberStatus.addedMembers,
// 							members,
// 						];
// 						console.log("memberStatus:", memberStatus);
// 					} else {
// 						// res.send({ validCred: "false" });
// 						console.log("Account NOT Found:");
// 						memberStatus.notAddedMembers = [
// 							...memberStatus.notAddedMembers,
// 							members,
// 						];
// 						console.log("memberStatus:", memberStatus);
// 					}
// 					return;
// 				});
// 			} catch (error) {
// 				console.error(error);
// 			}
// 		});
// 		console.log("Before memberStatus:", memberStatus);
// 		return memberStatus;
// 	}

// 	const result = filterMembers().then((result) => {
// 		console.log("Final memberStatus:", result);

// 		return result;
// 	});

// 	// console.log("Final memberStatus:", filterMembers().then((result) => result));
// 	// return memberStatus;
// });

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
