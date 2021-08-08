const mongoose = require("mongoose");

let messageSchema = mongoose.Schema({
    message: String,
    created: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model("testCollection", messageSchema, "testCollection")