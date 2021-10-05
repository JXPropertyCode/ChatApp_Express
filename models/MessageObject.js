const mongoose = require("mongoose");

let messageSchema = mongoose.Schema({
	room_id: String,
	username: String,
	email: String,
	password: String,
	timestamp: Number,
	clientMessage: String,
	created: {
		type: Number,
		default: Date.now(),
	},
});

module.exports = mongoose.model(
	"messageCollection",
	messageSchema,
	"messageCollection"
);
