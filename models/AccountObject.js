const mongoose = require("mongoose");

let accountSchema = mongoose.Schema({
	chatrooms: [String],
    username: String,
    email: String,
    password: String,
    lastModified: Number,
	createdAt: {
		type: Number,
		default: Date.now,
	},
});

module.exports = mongoose.model(
	"accountCollection",
	accountSchema,
	"accountCollection"
);
