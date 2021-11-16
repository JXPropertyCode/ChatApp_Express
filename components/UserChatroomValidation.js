const Account = require("../models/AccountObject");

const UserChatroomValidation = (req, res) => {
	console.log("Inside User Chatroom Validation...");
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

			if (data.length === 0) {
				res.send({ auth: false });
				return
			}

			for (let i = 0; i < data[0].chatrooms.length; i++) {
				console.log(reqData.reqChatroom, data[0].chatrooms[i]);
				if (reqData.reqChatroom === data[0].chatrooms[i]) {
					res.send({ auth: true });

					return;
					// return true;
				}
			}

			console.log("Cannot find Chatroom");
			res.send({ auth: false });
			return;
			// console.log("Sending data.chatrooms:", data[0].chatrooms)
			// res.send(data[0].chatrooms);
		}
	);
};

module.exports = UserChatroomValidation;
