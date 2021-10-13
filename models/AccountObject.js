const mongoose = require("mongoose");

let accountSchema = mongoose.Schema({
	userID: String,
	chatrooms: Array,
    username: String,
    email: String,
    password: String,
    timestamp: Number,
	created: {
		type: Number,
		default: Date.now(),
	},
});

module.exports = mongoose.model(
	"accountCollection",
	accountSchema,
	"accountCollection"
);