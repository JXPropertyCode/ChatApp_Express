const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let messageSchema = mongoose.Schema({
	roomID: String,
	userID: { type: Schema.Types.ObjectId, ref: 'accountCollection' },
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
