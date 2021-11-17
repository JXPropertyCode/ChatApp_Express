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


    Account.findByIdAndUpdate(
        { _id: userID },
        { $pull: { chatrooms: chatroomID } }
    )
        .then((res) => console.log("res:", res))
        .catch((err) => console.log("err:", err));

    Chatroom.findByIdAndUpdate(
        { _id: chatroomID },
        { $pull: { members: userID } }
    )
        .then((res) => console.log("res:", res))
        .catch((err) => console.log("err:", err));

    // await Chatroom.find({ _id: getUserChatrooms[i] })
    //     .then((data) => {
    //         console.log("data in chatroom:", data)
    //         userChatrooms.push({
    //             chatroomID: data[0]._id,
    //             chatroomName: data[0].chatroomName
    //         })
    //     })
    //     .catch((err) => err);


    // inside that specific user, it would add the chatroom to their accountCollection
    // Account.findByIdAndUpdate(
    //     { _id: reqData.addMembersList[i] },
    //     { $push: { chatrooms: reqData.currentChatroom } }
    // )
    //     .then((res) => console.log("res:", res))
    //     .catch((err) => console.log("err:", err));

    // inside that specific chatroom, it would also add the user to the chatroomCollection's member array
    // Chatroom.findByIdAndUpdate(
    //     { _id: reqData.currentChatroom },
    //     { $push: { members: reqData.addMembersList[i] } }
    // )
    //     .then((res) => console.log("res:", res))
    //     .catch((err) => console.log("err:", err));

}

module.exports = LeaveChatroom