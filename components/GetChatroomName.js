// const constants = require("ws/lib/constants");
const Chatroom = require("../models/ChatroomObject");

const GetChatroomName = async (req, res) => {
  let reqData = req.body;

  const getChatroomName = await Chatroom.find({
    _id: reqData.chatroomId,
  })
    .then((data) => {
      return data[0].chatroomName;
    })
    .catch((err) => err);

  res.send({ chatroomName: getChatroomName });
  return;
};

module.exports = GetChatroomName;
