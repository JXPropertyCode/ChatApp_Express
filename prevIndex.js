// Mongoose Connection
const mongoose = require("mongoose");
require("dotenv").config();

const express = require("express");
const { db } = require("./models/Message");
const Message = require("./models/Message");
const app = express();

// this is important even tho its not specfically used.
// express-ws needs to get a chance to set up support for Express routers
// note: as before, the expressWs instantly runs the functions when it gets called during initialization
const expressWs = require("express-ws")(app);
const PORT = 8000;

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

// the ws parameter is an instance of the WebSocket class
app.ws("/echo", function (ws, req) {

	ws.on("message", function (msg) {
		// received the message from React
		let messageParse = JSON.parse(msg);
		// to show the message we received from React
		console.log("Message Received in Server:", messageParse);

		// send the message back the React to visually confirm connection in React's console.logs
		ws.send(JSON.stringify(messageParse));
		// ws.broadcast(JSON.stringify(messageParse))

		console.log(app.clients)
		console.log("Message Sent from Server:", messageParse);
		// let convertResData = {
		// 	dateSent: messageParse.dateSent.toString(),
		// 	clientMessage: messageParse.clientMessage.toString(),
		// };

		// // insert data into DB
		// Message.create(convertResData, function (err) {
		// 	if (err) throw err;
		// });

		// let messageData = []
		// Message.find({}, function (err, data) {
		// 	if (err) {
		// 		console.log(err);
		// 	} else {
		// 		console.log("Data from MongoDB:", data);
		// 		// ws.send(JSON.stringify(messageParse));
		// 		// res.json(data);
		// 		messageData.push(JSON.stringify(data))
		// 	}
		// });
		// console.log("Sending Total Message Data")
		// ws.send(messageData);
	});
});

// when the server starts this will run
app.listen(PORT, () => {
	console.log(`Server Opened on Port: ${PORT}`);
});