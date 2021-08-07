var express = require("express");
var app = express();

// this is important even tho its not specfically used.
// express-ws needs to get a chance to set up support for Express routers
// note: as before, the expressWs instantly runs the functions when it gets called during initialization
const expressWs = require("express-ws")(app);
const PORT = 8000;

app.get("/", (req, res) => {
	// server health check on the localhost port
	res.send("200 OK");
});

// the ws parameter is an instance of the WebSocket class
app.ws("/", function (ws, req) {
	ws.on("message", function (msg) {
		// received the message from React
		console.log("Received:", msg);
		// send the message back the React to visually confirm connection in React's console.logs
		ws.send(msg)
	});
});

// when the server starts this will run
app.listen(PORT, () => {
	console.log(`Server Opened on Port: ${PORT}`)
})