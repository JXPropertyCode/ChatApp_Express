const Account = require("../models/AccountObject");
const Chatroom = require("../models/ChatroomObject");

const GetUserChatroom = async(req, res) => {
    console.log("Inside Get User Chatroom...");
    let reqData = req.body;

    // finding the email that is being requested to create an account
    // Account.find(
    // 	{ email: reqData.email, password: reqData.password },
    // 	function (err, data) {
    // 		if (err) {
    // 			console.log(err);
    // 			return err;
    // 		}

    // 		console.log("reqData:", reqData);
    // 		console.log("data[0].chatrooms:", data[0].chatrooms);

    // 		res.send({ chatrooms: data[0].chatrooms });
    // 		return;
    // 		// console.log("Sending data.chatrooms:", data[0].chatrooms)
    // 		// res.send(data[0].chatrooms);
    // 	}
    // );

    let userChatrooms = [];

    let getUserChatrooms = await Account.find({
            email: reqData.email,
            password: reqData.password,
        })
        .then((data) => {
            console.log("data[0].chatrooms:", data[0].chatrooms);
            return data[0].chatrooms;
        })
        .catch((err) => err);

    console.log("getUserChatrooms:", getUserChatrooms);

    for (let i = 0; i < getUserChatrooms.length; i++) {
        await Chatroom.find({ _id: getUserChatrooms[i] })
            .then((data) => {
                console.log("data in chatroom:", data)
                userChatrooms.push({
                    chatroomID: data[0]._id,
                    chatroomName: data[0].chatroomName
                })
            })
            .catch((err) => err);
    }

    res.send(userChatrooms)

    console.log("userChatrooms:", userChatrooms)
};

module.exports = GetUserChatroom;