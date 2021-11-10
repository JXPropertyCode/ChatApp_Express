const Account = require("../models/AccountObject");

const AddUsersToChatroom = (req, res) => {
	console.log("Inside Add Users to Chatroom...");
	// 	let reqData = req.body;

	// 	console.log("reqData:", reqData);

	// 	// finding the userId to add the user to the chatroom

	// 	let memberStatus = {
	// 		addedMembers: [],
	// 		notAddedMembers: [],
	// 	};

	// 	async function filterMembers() {
	// 		await reqData.addMembersList.forEach( async (members) => {
	// 			console.log("Members:", members);
	// 			try {
	// 				Account.find({ _id: members }, function (err, data) {
	// 					if (err) {
	// 						console.log(err);
	// 						res.send({ errorMessage: "This isn't a valid input." });
	// 						return err;
	// 					}

	// 					// console.log("data[0]:", data[0]);

	// 					if (data.length === 1) {
	// 						// res.send({
	// 						// 	validCred: "true",
	// 						// });
	// 						console.log("Account Found:", data[0]);

	// 						memberStatus.addedMembers = [
	// 							...memberStatus.addedMembers,
	// 							members,
	// 						];
	// 						console.log("memberStatus:", memberStatus);
	// 					} else {
	// 						// res.send({ validCred: "false" });
	// 						console.log("Account NOT Found:");
	// 						memberStatus.notAddedMembers = [
	// 							...memberStatus.notAddedMembers,
	// 							members,
	// 						];
	// 						console.log("memberStatus:", memberStatus);
	// 					}
	// 					return;
	// 				});
	// 			} catch (error) {
	// 				console.error(error);
	// 			}
	// 		});
	// 		console.log("Before memberStatus:", memberStatus);
	// 		return memberStatus;
	// 	}

	// 	const result = filterMembers().then((result) => {
	// 		console.log("Final memberStatus:", result);

	// 		return result;
	// 	});

	// 	// console.log("Final memberStatus:", filterMembers().then((result) => result));
	// 	// return memberStatus;
};

module.exports = AddUsersToChatroom;
