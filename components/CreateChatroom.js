const Chatroom = require("../models/ChatroomObject");
const Account = require("../models/AccountObject");


const CreateChatroom = (req, res) => {
	console.log("Inside Create Chatroom...");
	let reqData = req.body;

	// finding the email that is being requested to create an account
	function createChatRoom(err, data) {
		if (err) {
			console.log(err);
		}

		Account.find({ _id: reqData.userID }, function (err, data) {
			if (err) {
				throw err;
			}

			if (data.length === 1) {
				let convertReqData = {
					creatorUserID: String(reqData.userID),
					chatroomName: String(reqData.chatroomName),
					members: [reqData.userID],
					timestamp: Number(reqData.timestamp),
				};

				Chatroom.create(convertReqData, function (err, data) {
					if (err) throw err;

					console.log("Chatroom data:", data);

					res.send({
						validCred: "true",
						chatroomCreated: data._id,
					});

					Account.findByIdAndUpdate(
						{ _id: convertReqData.creatorUserID },
						{ $push: { chatrooms: data._id } }
					)
						.then((res) => console.log("res:", res))
						.catch((err) => console.log("err:", err));
				});

				// console.log("Chatroom Created:", result)

				// inserting a string into the chatrooms array inside the accountCollection of mongodb
				// Account.findByIdAndUpdate(
				// 	{ _id: reqData.userID },
				// 	{ $push: { chatrooms: reqData.chatroomName } }
				// )
				// 	.then((res) => console.log("res:", res))
				// 	.catch((err) => console.log("err:", err));

				// inserting a string into the chatrooms arracy inside the accountCollection of mongodb
				// Account.findOneAndUpdate(
				// 	{ _id: reqData.userID },
				// 	{ $push: { chatrooms: reqData.chatroomName } }
				// )
				// 	.then((res) => console.log("res:", res))
				// 	.catch((err) => console.log("err:", err));
			} else {
				res.send({ validCred: "false" });
				console.log("Account NOT Found, Cannot Update:", reqData);
			}

			// let convertReqData = {
			// 	creatorUserID: String(reqData.userID),
			// 	members: [reqData.userID],
			// 	timestamp: Number(reqData.timestamp),
			// };

			// Chatroom.create(convertReqData, function (err) {
			// 	if (err) throw err;
			// });

			// console.log(
			// 	"New Chatroom Created using convertReqData:",
			// 	convertReqData
			// );
		});
		console.log("reqData:", reqData);
	}

	createChatRoom();
}




module.exports = CreateChatroom