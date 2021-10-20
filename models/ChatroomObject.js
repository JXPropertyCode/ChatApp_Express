const mongoose = require("mongoose");

let chatroomSchema = mongoose.Schema({
	creatorUserID: String,
	members: [String],
    timestamp: Number,
	created: {
		type: Number,
		default: Date.now,
	},
});

module.exports = mongoose.model(
	"chatroomCollection",
	chatroomSchema,
	"chatroomCollection"
);
