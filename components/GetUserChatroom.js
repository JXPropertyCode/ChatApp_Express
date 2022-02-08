const Account = require("../models/AccountObject");
const Chatroom = require("../models/ChatroomObject");

const GetUserChatroom = async (req, res) => {
  let reqData = req.body;

  let userChatrooms = [];

  const getUserChatrooms = await Account.findOne({
    _id: reqData._id,
  });

  if (!getUserChatrooms) {
    // res.send("Error Cannot Get Chatroom from User:", reqData._id)
    res.send(userChatrooms);
  }

  const extractUserChatrooms = getUserChatrooms.chatrooms;

  // console.log("extractUserChatrooms:", extractUserChatrooms);

  for (let i = 0; i < extractUserChatrooms.length; i++) {
    // finds the chatroom based on the _id and send React its id and name so the user can identify the chatrooms
    const chatroom = await Chatroom.findOne({ _id: extractUserChatrooms[i] });
    // console.log("chatroom:", chatroom);

    // console.log("chatroom:", chatroom)

    // since if chatroom === null then you cannot res.send() you must say continue for this to work
    // this is for if the chatroom doesn't exist but still inside the account collection's chatroom array
    if (!chatroom) {
      continue;
    }

    userChatrooms.push({
      chatroomId: chatroom._id,
      chatroomName: chatroom.chatroomName,
    });
  }

  // console.log("userChatrooms:", userChatrooms)
  // sends React all the chatrooms
  res.send(userChatrooms);
};

module.exports = GetUserChatroom;
