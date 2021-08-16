const express = require("express");
const http = require("http");
const WebSocket = require("ws");

const app = express();

//initialize a simple http server
const server = http.createServer(app);

//initialize the WebSocket server instance
const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
	// console.log(wss.clients)
	//connection is up, let's add a simple simple event
	ws.on("message", (message) => {
		//log the received message and send it back to the client
		console.log("received: %s", message);
		// ws.send(`Hello, you sent -> ${message}`);

		let messageParse = JSON.parse(message)
		console.log("Message Sent from Server:", messageParse);
		let convertResData = {
			dateSent: messageParse.dateSent.toString(),
			clientMessage: messageParse.clientMessage.toString(),
		};



		wss.clients.forEach((client) => {
			client.send(JSON.stringify(convertResData));
		});
	});

	//send immediatly a feedback to the incoming connection
	ws.send("Hi there, I am a WebSocket server");
});

//start our server
server.listen(process.env.PORT || 8000, () => {
	console.log(`Server started on port ${server.address().port} :)`);
});
