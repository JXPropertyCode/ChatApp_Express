// Mongoose Connection
const mongoose = require("mongoose");
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const http = require("http");
const WebSocket = require("ws");
const { db } = require("./models/MessageObject");
const Message = require("./models/MessageObject");
const Account = require("./models/AccountObject");

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
db.once("open", function () {
	console.log("Connected to MongoDB successfully!");
});

db.on("error", function () {
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

app.get("/signup", (req, res) => {
	res.send("200 OK");
	// const createAccount = new Account
});

app.post("/signup", (req, res) => {
	// res.send("200 OK");

	console.log("Inside Account Validation...");
	let reqData = req.body;

	let convertReqData = {
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
			console.log("New Account Created:", reqData);
		}
	});
});

app.get("/login-validation", (req, res) => {
	res.send("200 OK");
	// const createAccount = new Account
});

app.post("/login-validation", (req, res) => {
	// res.send("200 OK");

	console.log("Inside Login Validation...");
	let reqData = req.body;

	// finding the email that is being requested to create an account
	Account.find(
		{ email: reqData.email, password: reqData.password },
		function (err, data) {
			if (err) {
				console.log(err);
			}

			if (data.length > 0) {
				res.send({ validCred: "true", username: data[0].username });
				console.log("Account Found:", reqData);
			} else {
				// insert into MongoDB
				res.send({ validCred: "false" });
				console.log("Account NOT Found:", reqData);
			}
		}
	);
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
			username: messageParse.username.toString(),
			email: messageParse.email.toString(),
			password: messageParse.password.toString(),
			dateSent: Number(messageParse.timestamp),
			clientMessage: messageParse.clientMessage.toString(),
		};

		Message.create(convertResData, function (err) {
			if (err) throw err;
		});

		console.log("Message Sent to Client:", convertResData);
		wss.clients.forEach((client) => {
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
