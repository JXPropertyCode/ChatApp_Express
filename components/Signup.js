const Account = require("../models/AccountObject");

const Signup = (req, res) => {
	console.log("Inside Account Validation...");
	let reqData = req.body;

	console.log("SignUp reqData:", reqData);

	let convertReqData = {
		// userID: String(reqData.userID),
		chatrooms: new Array(...reqData.chatrooms),
		username: String(reqData.username),
		email: String(reqData.email),
		password: String(reqData.password),
		timestamp: String(reqData.timestamp),
	};

	// finding the email that is being requested to create an account
	Account.find({ email: reqData.email }, function (err, data) {
		if (err) {
			console.log(err);
		}

		if (data.length > 0) {
			res.send({ validCred: "false" });
			console.log("Email Already Taken");
		} else {
			// insert into MongoDB
			res.send({ validCred: "true" });
			Account.create(convertReqData, function (err) {
				if (err) throw err;
			});
			console.log(
				"New Account Created using convertReqData:",
				convertReqData
			);
		}
	});
}

module.exports = Signup