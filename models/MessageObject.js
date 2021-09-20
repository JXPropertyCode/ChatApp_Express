const mongoose = require("mongoose");

let messageSchema = mongoose.Schema({
	username: String,
	email: String,
	password: String,
	dateSent: Number,
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
