const mongoose = require("mongoose");

let chatroomSchema = mongoose.Schema({
	creatorOwnerID: String,
    chatroomName: String,
	members: [Object],
    lastModified: Number,
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
