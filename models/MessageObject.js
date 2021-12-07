const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let messageSchema = mongoose.Schema({
	room: String,
	owner: { type: Schema.Types.ObjectId, ref: 'accountCollection' },
	username: String,
	email: String,
	password: String,
	clientMessage: String,
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

module.exports = mongoose.model(
	"messageCollection",
	messageSchema,
	"messageCollection"
);
