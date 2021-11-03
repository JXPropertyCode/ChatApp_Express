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
const { findOne } = require("./models/MessageObject");

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

	// this gets all the data from MongoDB and outputs it onto the local host
	// Message.find({}, function (err,data) {
	// 	if (err) {
	// 		console.log(err)
	// 	} else {
	// 		console.log("Data from MongoDB:", data)
	// 		res.json(data)
	// 	}
	// })
});

app.get("/messages", (req, res) => {
	// this gets all the data from MongoDB and outputs it onto the local host
	Message.find({}, function (err, data) {
		if (err) {
			console.log(err);
		} else {
			// console.log("Data from MongoDB:", data);
			res.json(data);
		}
	});
});

app.get("/chatrooms", (req, res) => {
	// this gets all the data from MongoDB and outputs it onto the local host
	Chatroom.find({}, function (err, data) {
		if (err) {
			console.log(err);
		} else {
			// console.log("Data from MongoDB:", data);
			res.json(data);
		}
	});
});

app.get("/signup", (req, res) => {
	res.send("200 OK");
});

app.post("/signup", (req, res) => {
	console.log("Inside Account Validation...");
	let reqData = req.body;

	console.log("SignUp reqData:", reqData);

	let convertReqData = {
		// userID: String(reqData.userID),
		chatrooms: new Array(...reqData.chatrooms),
		username: String(reqData.username),
		email: String(reqData.email),
		password: String(reqData.password),
		timestamp: String(reqData.timestamp),
	};

	// finding the email that is being requested to create an account
	Account.find({ email: reqData.email }, function (err, data) {
		if (err) {
			console.log(err);
		}

		if (data.length > 0) {
			res.send({ validCred: "false" });
			console.log("Email Already Taken");
		} else {
			// insert into MongoDB
			res.send({ validCred: "true" });
			Account.create(convertReqData, function (err) {
				if (err) throw err;
			});
			console.log(
				"New Account Created using convertReqData:",
				convertReqData
			);
		}
	});
});

app.get("/login-validation", (req, res) => {
	res.send("200 OK");
});

app.post("/login-validation", (req, res) => {
	console.log("Inside Login Validation...");
	let reqData = req.body;

	// finding the email that is being requested to create an account
	Account.find(
		{ email: reqData.email, password: reqData.password },
		function (err, data) {
			if (err) {
				console.log(err);
			}

			console.log("data[0]:", data[0]);

			if (data.length === 1) {
				res.send({
					validCred: "true",
					username: data[0].username,
					userID: data[0]._id,
				});
				console.log("Account Found:", reqData);
			} else {
				// insert into MongoDB
				res.send({ validCred: "false" });
				console.log("Account NOT Found:", reqData);
			}
		}
	);
});

app.get("/user-chatroom-validation", (req, res) => {
	res.send("200 OK");
});

app.post("/user-chatroom-validation", (req, res) => {
	console.log("Inside User Chatroom Validation...");
	let reqData = req.body;

	// finding the email that is being requested to create an account
	Account.find(
		{ email: reqData.email, password: reqData.password },
		function (err, data) {
			if (err) {
				console.log(err);
				return err;
			}

			console.log("reqData:", reqData);
			console.log("data[0].chatrooms:", data[0].chatrooms);

			for (let i = 0; i < data[0].chatrooms.length; i++) {
				console.log(reqData.reqChatroom, data[0].chatrooms[i]);
				if (reqData.reqChatroom === data[0].chatrooms[i]) {
					res.send({ auth: true });

					return;
					// return true;
				}
			}

			console.log("Cannot find Chatroom");
			res.send({ auth: false });
			return;
			// console.log("Sending data.chatrooms:", data[0].chatrooms)
			// res.send(data[0].chatrooms);
		}
	);
});

app.get("/get-user-chatroom", (req, res) => {
	res.send("200 OK");
});

app.post("/get-user-chatroom", (req, res) => {
	console.log("Inside Get User Chatroom...");
	let reqData = req.body;

	// finding the email that is being requested to create an account
	Account.find(
		{ email: reqData.email, password: reqData.password },
		function (err, data) {
			if (err) {
				console.log(err);
				return err;
			}

			console.log("reqData:", reqData);
			console.log("data[0].chatrooms:", data[0].chatrooms);

			res.send({"chatrooms": data[0].chatrooms});
			return;
			// console.log("Sending data.chatrooms:", data[0].chatrooms)
			// res.send(data[0].chatrooms);
		}
	);
});

app.get("/create-chatroom", (req, res) => {
	res.send("200 OK");
});

app.post("/create-chatroom", (req, res) => {
	console.log("Inside Create Chatroom...");
	let reqData = req.body;

	// finding the email that is being requested to create an account
	function createChatRoom(err, data) {
		if (err) {
			console.log(err);
		}

		Account.find({ _id: reqData.userID }, async function (err, data) {
			if (err) {
				throw err;
			}

			if (data.length === 1) {
				let convertReqData = {
					creatorUserID: String(reqData.userID),
					chatroomName: String(reqData.chatroomName),
					members: [reqData.userID],
					timestamp: Number(reqData.timestamp),
				};

				Chatroom.create(convertReqData, function (err, data) {
					if (err) throw err;

					console.log("Chatroom data:", data);

					res.send({
						validCred: "true",
						chatroomCreated: data._id,
					});

					Account.findByIdAndUpdate(
						{ _id: convertReqData.creatorUserID },
						{ $push: { chatrooms: data._id } }
					)
						.then((res) => console.log("res:", res))
						.catch((err) => console.log("err:", err));
				});

				// console.log("Chatroom Created:", result)

				// inserting a string into the chatrooms array inside the accountCollection of mongodb
				// Account.findByIdAndUpdate(
				// 	{ _id: reqData.userID },
				// 	{ $push: { chatrooms: reqData.chatroomName } }
				// )
				// 	.then((res) => console.log("res:", res))
				// 	.catch((err) => console.log("err:", err));

				// inserting a string into the chatrooms arracy inside the accountCollection of mongodb
				// Account.findOneAndUpdate(
				// 	{ _id: reqData.userID },
				// 	{ $push: { chatrooms: reqData.chatroomName } }
				// )
				// 	.then((res) => console.log("res:", res))
				// 	.catch((err) => console.log("err:", err));
			} else {
				res.send({ validCred: "false" });
				console.log("Account NOT Found, Cannot Update:", reqData);
			}

			// let convertReqData = {
			// 	creatorUserID: String(reqData.userID),
			// 	members: [reqData.userID],
			// 	timestamp: Number(reqData.timestamp),
			// };

			// Chatroom.create(convertReqData, function (err) {
			// 	if (err) throw err;
			// });

			// console.log(
			// 	"New Chatroom Created using convertReqData:",
			// 	convertReqData
			// );
		});
		console.log("reqData:", reqData);
	}

	createChatRoom();
});

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
