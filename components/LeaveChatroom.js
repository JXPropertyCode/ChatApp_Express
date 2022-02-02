const Chatroom = require("../models/ChatroomObject");
const Account = require("../models/AccountObject");

const LeaveChatroom = (req, res) => {
  let reqData = req.body;
  const owner = reqData.owner;
  const chatroomId = reqData.chatroomId;

  // users account would delete its chatroom
  Account.findByIdAndUpdate(
    { _id: owner },
    { $pull: { chatrooms: chatroomId }, $set: { lastModified: Date.now() } }
  )
    .then((res) => res)
    .catch((err) => err);

  // chatroom would remove the member
  Chatroom.findByIdAndUpdate(
    { _id: chatroomId },
    { $pull: { members: owner }, $set: { lastModified: Date.now() } }
  )
    .then((res) => res)
    .catch((err) => err);
};

module.exports = LeaveChatroom;
