const Chatroom = require("../models/ChatroomObject");
const Account = require("../models/AccountObject");

const GetChatroomMembers = async (req, res) => {
  let reqData = req.body;

  const currentChatroom = reqData.chatroom;
  const membersInChatroom = [];

  // as a reminder from the AddUsersToChatroom, callbacks maybe harder to use when trying to use with async and await
  // could possibly persist in callback hell that is why I use this way as a promise

  // see if the chatroom exists
  const chatroomData = await Chatroom.findOne({ _id: currentChatroom });

  if (!chatroomData) {
    res.send({
      membersInChatroom: membersInChatroom,
      error: "Cannot Get Chatroom Members",
    });
    return;
  }

  // console.log("chatroomData:", chatroomData);

  // if chatroom exists, find the _id of the members then get their user name then send it back to React to output it
  for (let i = 0; i < chatroomData.members.length; i++) {
    const accountFound = await Account.findOne({
      _id: chatroomData.members[i],
    });

    if (!accountFound) {
      console.log("Account Not Found...");
      continue;
    }

    // console.log("accountFound:", accountFound);

    membersInChatroom.push({
      username: accountFound.username,
      owner: accountFound._id,
    });
  }

  // console.log("membersInChatroom:", membersInChatroom);
  res.send({
    membersInChatroom: membersInChatroom,
  });
};

module.exports = GetChatroomMembers;
