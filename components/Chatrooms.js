const Chatroom = require("../models/ChatroomObject");

const Chatrooms = (req, res) => {
	// this gets all the data from MongoDB and outputs it onto the local host
	Chatroom.find({}, function (err, data) {
		if (err) {
			// console.log(err);
			return err
		} else {
			// console.log("Data from MongoDB:", data);
			res.json(data);
		}
	});
};

module.exports = Chatrooms;
