const Account = require("../models/AccountObject");

const VerifyAuthToAddUsersToChatroom = (req, res) => {
	console.log("Verify Auth to Add Users to Chatroom...");
	let reqData = req.body;
	console.log("reqData:", reqData);

	// finding the email that is being requested to create an account
	Account.find(
		{ email: reqData.email, password: reqData.password },
		function (err, data) {
			if (err) {
				console.log(err);
				return err;
			}

			console.log("data[0]:", data[0]);

			if (data.length === 1) {
				res.send({
					validCred: "true",
				});
				console.log(
					"Account Auth to Add Members to Chatroom:",
					reqData
				);

				// for (let i=0; i<reqData.addMembers.length; i++) {
				// 	console.log("reqData.addMembers[" + i + "]:", reqData.addMembers[i])
				// }
			} else {
				res.send({ validCred: "false" });
				console.log("Account NOT Found:", reqData);
				return;
			}
		}
	);

	return;
};

module.exports = VerifyAuthToAddUsersToChatroom;
