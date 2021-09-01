const mongoose = require("mongoose");

let accountSchema = mongoose.Schema({
    username: String,
    email: String,
    password: String,
    timestamp: String,
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
