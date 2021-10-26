const mongoose = require("mongoose");

let chatroomSchema = mongoose.Schema({
	creatorUserID: String,
    chatroomName: String,
	members: [String],
    timestamp: Number,
	createdAt: {
		type: Number,
		default: Date.now,
	},
});

module.exports = mongoose.model(
	"chatroomCollection",
	chatroomSchema,
	"chatroomCollection"
);
