const Account = require("../models/AccountObject");

const GetUserChatroom = (req, res) => {
	console.log("Inside Get User Chatroom...");
	let reqData = req.body;

	// finding the email that is being requested to create an account
	Account.find(
		{ email: reqData.email, password: reqData.password },
		function (err, data) {
			if (err) {
				console.log(err);
				return err;
			}

			console.log("reqData:", reqData);
			console.log("data[0].chatrooms:", data[0].chatrooms);

			res.send({ chatrooms: data[0].chatrooms });
			return;
			// console.log("Sending data.chatrooms:", data[0].chatrooms)
			// res.send(data[0].chatrooms);
		}
	);
}

module.exports = GetUserChatroom