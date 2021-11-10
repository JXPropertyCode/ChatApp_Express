const Account = require("../models/AccountObject");

async function filterMembers(reqData) {
	let memberStatus = {
		addedMembers: [],
		notAddedMembers: [],
	};

	for (let i = 0; i < reqData.addMembersList.length; i++) {
		// using callbacks such as Account.find({}, () => {}). is already async. And would result in call back hell in this senario
		let isUserFound = await Account.find({ _id: reqData.addMembersList[i] })
			.then((data) => (data ? true : false))
			.catch((err) => false);

		if (isUserFound) {
			memberStatus.addedMembers.push(reqData.addMembersList[i]);
		} else {
			memberStatus.notAddedMembers.push(reqData.addMembersList[i]);
		}
	}
	// console.log("After memberStatus:", memberStatus);
	return memberStatus;
}

const AddUsersToChatroom = async (req, res) => {
	console.log("Inside Add Users to Chatroom...");
	const reqData = req.body;

	console.log("reqData:", reqData);

	// finding the userId to add the user to the chatroom
	const memberChatroomStatus = await filterMembers(reqData);
	console.log("memberChatroomStatus:", memberChatroomStatus)
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
