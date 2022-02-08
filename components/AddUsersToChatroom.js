const res = require("express/lib/response");
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

    try {
      const isUserFound = await Account.findOne({
        _id: reqData.addMembersList[i],
      });

      if (isUserFound) {
        // if the account already has this chatroom, don't add it
        const reqUserFound = await Account.findOne({
          _id: reqData.addMembersList[i],
          chatrooms: { $all: reqData.currentChatroom },
        });
        if (reqUserFound) {
          memberStatus.notAddedMembers.push(reqData.addMembersList[i]);
        } else {
          memberStatus.addedMembers.push(reqData.addMembersList[i]);

          // inside that specific user, it would add the chatroom to their accountCollection
          const updatingUserChatrooms = await Account.findByIdAndUpdate(
            { _id: reqData.addMembersList[i] },
            {
              $push: { chatrooms: reqData.currentChatroom },
              $set: { lastModified: Date.now() },
            }
          )
            .then((res) => res)
            .catch((err) => err);

          // console.log("updatingUserChatrooms:", updatingUserChatrooms);

          if (!updatingUserChatrooms) {
            res.send(
              "error at updatingUserChatrooms at user _id:",
              reqData.addMembersList[i]
            );
            continue
          }

          // inside that specific chatroom, it would also add the user to the chatroomCollection's member array
          const updatingChatroomMembers = await Chatroom.findByIdAndUpdate(
            { _id: reqData.currentChatroom },
            {
              $push: { members: reqData.addMembersList[i] },
              $set: { lastModified: Date.now() },
            }
          )
            .then((res) => res)
            .catch((err) => err);

          // console.log("updatingChatroomMembers:", updatingChatroomMembers);
          if (!updatingChatroomMembers) {
            res.send(
              "error at updatingChatroomMembers at chatroom _id:",
              reqData.currentChatroom
            );
            continue
          }
        }
      }
    } catch (err) {
      // console.log("err:", err);
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
