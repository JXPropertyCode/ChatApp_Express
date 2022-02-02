const Account = require("../models/AccountObject");
const Chatroom = require("../models/ChatroomObject");

const GetUserChatroom = async (req, res) => {
  let reqData = req.body;

  let userChatrooms = [];

  let getUserChatrooms = await Account.find({
    email: reqData.email,
  })
    .then((data) => {
      return data[0].chatrooms;
    })
    .catch((err) => err);

  for (let i = 0; i < getUserChatrooms.length; i++) {
    await Chatroom.find({ _id: getUserChatrooms[i] })
      .then((data) => {
        userChatrooms.push({
          chatroomId: data[0]._id,
          chatroomName: data[0].chatroomName,
        });
      })
      .catch((err) => err);
  }

  res.send(userChatrooms);
};

module.exports = GetUserChatroom;
