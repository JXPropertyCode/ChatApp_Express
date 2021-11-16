const Account = require("../models/AccountObject");
const Chatroom = require("../models/ChatroomObject");


async function filterMembers(reqData) {
	let memberStatus = {
		addedMembers: [],
		notAddedMembers: [],
	};

	for (let i = 0; i < reqData.addMembersList.length; i++) {
		// using callbacks such as Account.find({}, () => {}). is already async. And would result in call back hell in this senario
		// for loop wound run everything before it can update the memberStatus object
		let isUserFound = await Account.find({ _id: reqData.addMembersList[i] })
			.then((data) => (data ? true : false))
			.catch((err) => false);

		if (isUserFound) {
			console.log("User Found:", reqData.addMembersList[i]);
			// memberStatus.addedMembers.push(reqData.addMembersList[i]);

			// if the account already has this chatroom, don't add it
			await Account.find({
				_id: reqData.addMembersList[i],
				chatrooms: { $all: reqData.currentChatroom },
			})
				.then((data) => {
					if (data.length === 1) {
						console.log(
							"Chatroom Already Exists In This Account..."
						);
						memberStatus.notAddedMembers.push(
							reqData.addMembersList[i]
						);
					} else {
						console.log("Chatroom Being Added to This Account...");
						memberStatus.addedMembers.push(
							reqData.addMembersList[i]
						);

						// inside that specific user, it would add the chatroom to their accountCollection
						Account.findByIdAndUpdate(
							{ _id: reqData.addMembersList[i] },
							{ $push: { chatrooms: reqData.currentChatroom } }
						)
							.then((res) => console.log("res:", res))
							.catch((err) => console.log("err:", err));

						// inside that specific chatroom, it would also add the user to the chatroomCollection's member array
						Chatroom.findByIdAndUpdate(
							{ _id: reqData.currentChatroom },
							{ $push: { members: reqData.addMembersList[i] } }
						)
							.then((res) => console.log("res:", res))
							.catch((err) => console.log("err:", err));
					}
				})
				.catch((err) => err);
		} else {
			console.log("User NOT Found:", reqData.addMembersList[i]);
			memberStatus.notAddedMembers.push(reqData.addMembersList[i]);
		}
	}
	// console.log("After memberStatus:", memberStatus);
	return memberStatus;
}

// Account.findByIdAndUpdate(
// 	{ _id: reqData.addMembersList[i] },
// 	{ $push: { chatrooms: currentChatroom } }
// )
// 	.then((res) => console.log("res:", res))
// 	.catch((err) => console.log("err:", err));

const AddUsersToChatroom = async (req, res) => {
	console.log("Inside Add Users to Chatroom...");
	const reqData = req.body;

	console.log("reqData:", reqData);

	// finding the userId to add the user to the chatroom
	const memberChatroomStatus = await filterMembers(reqData);
	console.log("memberChatroomStatus:", memberChatroomStatus);
};

module.exports = AddUsersToChatroom; 

// Account.find(
// 	{ _id: reqData.addMembersList[i] },
// 	function (err, data) {
// 		if (err) {
// 			console.log(err);
// 			res.send({ errorMessage: "This isn't a valid input." });
// 			return err;
// 		}

// 		// console.log("data[0]:", data[0]);

// 		if (data.length === 1) {
// 			// res.send({
// 			// 	validCred: "true",
// 			// });
// 			console.log("Account Found:", data[0]);

// 			memberStatus.addedMembers = [
// 				...memberStatus.addedMembers,
// 				reqData.addMembersList[i],
// 			];
// 			console.log("memberStatus:", memberStatus);
// 		} else {
// 			// res.send({ validCred: "false" });
// 			console.log("Account NOT Found:");
// 			memberStatus.notAddedMembers = [
// 				...memberStatus.notAddedMembers,
// 				reqData.addMembersList[i],
// 			];
// 			console.log("memberStatus:", memberStatus);
// 		}
// 		return;
// 	}
// );
