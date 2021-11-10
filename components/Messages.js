const Message = require("../models/MessageObject");

const Messages = (req, res) => {
	// this gets all the data from MongoDB and outputs it onto the local host
	Message.find({}, function (err, data) {
		if (err) {
			console.log(err);
		} else {
			// console.log("Data from MongoDB:", data);
			return res.json(data);
		}
	});
};

module.exports = Messages;
