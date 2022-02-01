const mongoose = require("mongoose");

let accountSchema = mongoose.Schema({
  chatrooms: [String],
  username: String,
  email: String,
  password: String,
  googleId: String,
  confirmed: {
    type: Boolean,
    default: false,
  },
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
  "accountCollection",
  accountSchema,
  "accountCollection"
);
