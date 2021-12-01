const Chatroom = require("../models/ChatroomObject");
const Account = require("../models/AccountObject");

const CreateChatroom = (req, res) => {
  console.log("Inside Create Chatroom...");
  let reqData = req.body;

  // finding the email that is being requested to create an account
  function createChatRoom(err, data) {
    if (err) {
      console.log(err);
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
          lastModified: Number(reqData.lastModified),
        };

		// Chatroom collection creates a new document
        Chatroom.create(convertReqData, function (err, data) {
          if (err) throw err;

          console.log("Chatroom data:", data);

          res.send({
            validCred: "true",
            chatroomCreated: data._id,
          });

          Account.findByIdAndUpdate(
            { _id: convertReqData.creatorOwnerID },
			// data._id is from the chatroom that was created. so after creating chatroom, it gives its ObjectId to Account
            { $push: { chatrooms: data._id } }
          )
            .then((res) => console.log("res:", res))
            .catch((err) => console.log("err:", err));
        });
      } else {
        res.send({ validCred: "false" });
        console.log("Account NOT Found, Cannot Update:", reqData);
      }
    });
    console.log("reqData:", reqData);
  }

  createChatRoom();
};

module.exports = CreateChatroom;
