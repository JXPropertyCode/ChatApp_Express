const Chatroom = require("../models/ChatroomObject");
const Account = require("../models/AccountObject");

const CreateChatroom = (req, res) => {
  let reqData = req.body;

  // finding the email that is being requested to create an account
  function createChatRoom(err, data) {
    if (err) {
    }

    // if the account is found, then it would create a new chatroom in chatroomCollection
    Account.find({ _id: reqData.owner }, function (err, data) {
      if (err) {
        throw err;
      }

      if (data.length === 1) {
        let convertReqData = {
          creatorOwnerID: String(reqData.owner),
          chatroomName: String(reqData.chatroomName),
          members: [reqData.owner],
        };

        // Chatroom collection creates a new document
        Chatroom.create(convertReqData, function (err, data) {
          if (err) throw err;

          res.send({
            validCred: "true",
            chatroomCreated: data._id,
          });

          Account.findByIdAndUpdate(
            { _id: convertReqData.creatorOwnerID },
            // data._id is from the chatroom that was created. so after creating chatroom, it gives its ObjectId to Account
            { $push: { chatrooms: data._id } }
          )
            .then((res) => res)
            .catch((err) => err);
        });
      } else {
        res.send({ validCred: "false" });
      }
    });
  }

  createChatRoom();
};

module.exports = CreateChatroom;
