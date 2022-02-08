const Chatroom = require("../models/ChatroomObject");
const Account = require("../models/AccountObject");

const LeaveChatroom = async (req, res) => {
  let reqData = req.body;
  const owner = reqData.owner;
  const chatroomId = reqData.chatroomId;

  // send logs to React
  let result = {};

  // users account would delete its chatroom
  await Account.findByIdAndUpdate(
    { _id: owner },
    { $pull: { chatrooms: chatroomId }, $set: { lastModified: Date.now() } }
  )
    .then((res) => {
      result.updateAccount = "Success";
      return res;
    })
    .catch((err) => {
      result.updateAccount = "Failed";
      return err;
    });

  // chatroom would remove the member
  await Chatroom.findByIdAndUpdate(
    { _id: chatroomId },
    { $pull: { members: owner }, $set: { lastModified: Date.now() } }
  )
    .then((res) => {
      result.updateChatroom = "Success";
      return res;
    })
    .catch((err) => {
      result.updateChatroom = "Failed";
      return err;
    });

  res.send(result);
};

module.exports = LeaveChatroom;
