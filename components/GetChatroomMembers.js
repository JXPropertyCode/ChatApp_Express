const Chatroom = require("../models/ChatroomObject");
const Account = require("../models/AccountObject");

const GetChatroomMembers = async (req, res) => {
  let reqData = req.body;

  const currentChatroom = reqData.chatroom;
  const membersInChatroom = [];

  // as a reminder from the AddUsersToChatroom, callbacks maybe harder to use when trying to use with async and await
  // could possibly persist in callback hell that is why I use this way as a promise

  // see if the chatroom exists
  let chatroomData = await Chatroom.find({ _id: currentChatroom })
    .then((data) => data)
    .catch((err) => err);

  if (chatroomData.length === 1) {
    // if chatroom exists, find the _id of the members then get their user name then send it back to React to output it
    for (let i = 0; i < chatroomData[0].members.length; i++) {
      await Account.find({ _id: chatroomData[0].members[i] })
        .then((data) => {
          membersInChatroom.push(data[0]);
          return data[0];
        })
        .catch((err) => err);
    }
  }

  res.send({
    membersInChatroom: membersInChatroom,
  });
};

module.exports = GetChatroomMembers;
