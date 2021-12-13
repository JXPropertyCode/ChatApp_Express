const Chatroom = require("../models/ChatroomObject");
const Account = require("../models/AccountObject");
const { reset } = require("nodemon");

const LeaveChatroom = (req, res) => {
  let reqData = req.body;

  // console.log("In Leave Chatroom...");
  // console.log("reqData:", reqData);

  const owner = reqData.owner;
  const chatroomId = reqData.chatroomId;

  // console.log("To be Removed owner:", owner);
  // console.log("To be Removed chatroomId:", chatroomId);

  // users account would delete its chatroom
  Account.findByIdAndUpdate(
    { _id: owner },
    { $pull: { chatrooms: chatroomId }, $set: { lastModified: Date.now() } }
  )
    .then(
      (res) =>
        // console.log("res:", res)
        res
    )
    .catch(
      (err) =>
        // console.log("err:", err)
        err
    );

  // chatroom would remove the member
  Chatroom.findByIdAndUpdate(
    { _id: chatroomId },
    { $pull: { members: owner }, $set: { lastModified: Date.now() } }
  )
    .then(
      (res) =>
        // console.log("res:", res)
        res
    )
    .catch(
      (err) =>
        // console.log("err:", err)
        err
    );
};

module.exports = LeaveChatroom;
