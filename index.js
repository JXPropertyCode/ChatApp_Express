// Mongoose Connection
const mongoose = require("mongoose");
require("dotenv").config();

const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const { db } = require("./models/Message");
const Message = require("./models/Message");

const app = express();

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

wss.on("connection", (ws) => {
	// console.log(wss.clients)
	//connection is up, let's add a simple simple event
	ws.on("message", (message) => {
		// log the received message and send it back to the client
		let messageParse = JSON.parse(message);
		console.log("Received from Client:", messageParse);

		let convertResData = {
			dateSent: messageParse.dateSent.toString(),
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
