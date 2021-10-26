const mongoose = require("mongoose");

let messageSchema = mongoose.Schema({
	roomID: String,
	userID: String,
	username: String,
	email: String,
	password: String,
	timestamp: Number,
	clientMessage: String,
	createdAt: {
		type: Number,
		default: Date.now,
	},
});

module.exports = mongoose.model(
	"messageCollection",
	messageSchema,
	"messageCollection"
);
