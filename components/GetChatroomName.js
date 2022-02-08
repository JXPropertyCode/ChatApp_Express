// const constants = require("ws/lib/constants");
const Chatroom = require("../models/ChatroomObject");

const GetChatroomName = async (req, res) => {
  let reqData = req.body;

  const getChatroomName = await Chatroom.findOne({
    _id: reqData.chatroomId,
  });

  if (!getChatroomName) {
    res.send({ message: "Failed To Get Chatroom Name" });
    return;
  }

  res.send({ chatroomName: getChatroomName.chatroomName });
  return;
};

module.exports = GetChatroomName;
