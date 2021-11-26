const Chatroom = require("../models/ChatroomObject");
const Account = require("../models/AccountObject");


const LeaveChatroom = (req, res) => {
    let reqData = req.body

    console.log("In Leave Chatroom...")
    console.log("reqData:", reqData)

    const userID = reqData.userID
    const chatroomID = reqData.chatroomID

    console.log("To be Removed userID:", userID)
    console.log("To be Removed chatroomID:", chatroomID)


    // users account would delete its chatroom
    Account.findByIdAndUpdate(
        { _id: userID },
        { $pull: { chatrooms: chatroomID } }
    )
        .then((res) => console.log("res:", res))
        .catch((err) => console.log("err:", err));

    // chatroom would remove the member
    Chatroom.findByIdAndUpdate(
        { _id: chatroomID },
        { $pull: { members: userID } }
    )
        .then((res) => console.log("res:", res))
        .catch((err) => console.log("err:", err));

}

module.exports = LeaveChatroom