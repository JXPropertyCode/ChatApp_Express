const Account = require("../models/AccountObject");
const Chatroom = require("../models/ChatroomObject");

async function filterMembers(reqData) {
  let memberStatus = {
    addedMembers: [],
    notAddedMembers: [],
  };

  for (let i = 0; i < reqData.addMembersList.length; i++) {
    // using callbacks such as Account.find({}, () => {}). is already async. And would result in call back hell in this senario
    // for loop wound run everything before it can update the memberStatus object
    let isUserFound = await Account.find({ _id: reqData.addMembersList[i] })
      .then((data) => (data ? true : false))
      .catch((err) => false);

    if (isUserFound) {
      // if the account already has this chatroom, don't add it
      await Account.find({
        _id: reqData.addMembersList[i],
        chatrooms: { $all: reqData.currentChatroom },
      })
        .then((data) => {
          if (data.length === 1) {
            memberStatus.notAddedMembers.push(reqData.addMembersList[i]);
          } else {
            memberStatus.addedMembers.push(reqData.addMembersList[i]);

            // inside that specific user, it would add the chatroom to their accountCollection
            Account.findByIdAndUpdate(
              { _id: reqData.addMembersList[i] },
              {
                $push: { chatrooms: reqData.currentChatroom },
                $set: { lastModified: Date.now() },
              }
            )
              .then((res) => res)
              .catch((err) => err);

            // inside that specific chatroom, it would also add the user to the chatroomCollection's member array
            Chatroom.findByIdAndUpdate(
              { _id: reqData.currentChatroom },
              {
                $push: { members: reqData.addMembersList[i] },
                $set: { lastModified: Date.now() },
              }
            )
              .then((res) => res)
              .catch((err) => err);
          }
        })
        .catch((err) => err);
    } else {
      memberStatus.notAddedMembers.push(reqData.addMembersList[i]);
    }
  }
  return memberStatus;
}

const AddUsersToChatroom = async (req, res) => {
  const reqData = req.body;

  // finding the owner to add the user to the chatroom
  const memberChatroomStatus = await filterMembers(reqData);
  res.send(memberChatroomStatus);
};

module.exports = AddUsersToChatroom;
