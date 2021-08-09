const mongoose = require("mongoose");

let messageSchema = mongoose.Schema({
	dateSent: String,
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
