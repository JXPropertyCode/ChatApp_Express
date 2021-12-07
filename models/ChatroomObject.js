const mongoose = require("mongoose");

let chatroomSchema = mongoose.Schema({
	creatorOwnerID: String,
    chatroomName: String,
	members: [Object],
    lastModified: {
		type: Date,
		default: Date.now,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

module.exports = mongoose.model(
	"chatroomCollection",
	chatroomSchema,
	"chatroomCollection"
);
