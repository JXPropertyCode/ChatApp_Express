const Chatroom = require("../models/ChatroomObject");
const Account = require("../models/AccountObject");

const LeaveChatroom = (req, res) => {
  let reqData = req.body;

  console.log("In Leave Chatroom...");
  console.log("reqData:", reqData);

  const owner = reqData.owner;
  const chatroomId = reqData.chatroomId;

  console.log("To be Removed owner:", owner);
  console.log("To be Removed chatroomId:", chatroomId);

  // users account would delete its chatroom
  Account.findByIdAndUpdate(
    { _id: owner },
    { $pull: { chatrooms: chatroomId } }
  )
    .then((res) => console.log("res:", res))
    .catch((err) => console.log("err:", err));

  // chatroom would remove the member
  Chatroom.findByIdAndUpdate(
    { _id: chatroomId },
    { $pull: { members: owner } }
  )
    .then((res) => console.log("res:", res))
    .catch((err) => console.log("err:", err));
};

module.exports = LeaveChatroom;
