var express = require("express");
var app = express();
const expressWs = require("express-ws")(app);
const PORT = 8000;

app.get("/", (req, res) => {
	res.send("200 OK");
});

app.ws("/", function (ws, req) {
	ws.on("message", function (msg) {
		// received the message from React
		console.log("Received:", msg);
		// send the message back the React to visually confirm connection
		ws.send(msg)
	});
});

app.listen(PORT, () => {
	console.log(`Server Opened on Port: ${PORT}`)
})