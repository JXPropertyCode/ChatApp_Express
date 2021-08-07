const express = require("express");
const app = express();
const PORT = 8000;

const WebSocketClient = require("websocket").client;
const WebSocketFrame = require("websocket").frame;
const WebSocketRouter = require("websocket").router;
const W3CWebSocket = require("websocket").w3cwebsocket;

var WebSocketServer = require("websocket").server;
var http = require("http");

// this enables health check for the specific port/server
// would also display on the terminal of the request path
var server = http.createServer(function (request, response) {
	console.log(new Date() + " Received request for " + request.url);
	response.writeHead(200, { "Content-Type": "text/plain" });
	response.write("Hello World!");
	response.end();
});

server.listen(PORT, (req, res) => {
	console.log(new Date() + ` Server is listening on port ${PORT}`);
});

wsServer = new WebSocketServer({
	httpServer: server,
	// You should not use autoAcceptConnections for production
	// applications, as it defeats all standard cross-origin protection
	// facilities built into the protocol and the browser.  You should
	// *always* verify the connection's origin and decide whether or not
	// to accept it.
	autoAcceptConnections: false,
});

function originIsAllowed(origin) {
	// put logic here to detect whether the specified origin is allowed.
	return true;
}

wsServer.on("request", function (request) {
	if (!originIsAllowed(request.origin)) {
		// Make sure we only accept requests from an allowed origin
		request.reject();
		console.log(
			new Date() +
				" Connection from origin " +
				request.origin +
				" rejected."
		);
		return;
	}

	var connection = request.accept("echo-protocol", request.origin);
	console.log(new Date() + " Connection accepted.");
	connection.on("message", function (message) {
		if (message.type === "utf8") {
			console.log("Received Message: " + message.utf8Data);
			connection.sendUTF(message.utf8Data);
		} else if (message.type === "binary") {
			console.log(
				"Received Binary Message of " +
					message.binaryData.length +
					" bytes"
			);
			connection.sendBytes(message.binaryData);
		}
	});
	connection.on("close", function (reasonCode, description) {
		console.log(
			new Date() + " Peer " + connection.remoteAddress + " disconnected."
		);
	});
});
