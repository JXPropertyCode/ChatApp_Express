const Chatroom = require("../models/ChatroomObject");
const Account = require("../models/AccountObject");

const CreateChatroom = async (req, res) => {
  let reqData = req.body;

  // finding the email that is being requested to create an account
  async function createChatRoom(err, data) {
    if (err) {
      throw err;
    }

    // if the account is found, then it would create a new chatroom in chatroomCollection
    const findUserById = await Account.findOne({ _id: reqData.owner });

    // console.log("findUserById:", findUserById);

    if (!findUserById) {
      // console.log("Error in Creating Chatroom from User:", reqData.owner);
      res.send({ validCred: "false" });
      return;
    }

    // to send entire log to React about issues or successes
    let result = {};

    // preparing to create new chatroom in chatroom collection
    let convertReqData = {
      creatorOwnerID: String(reqData.owner),
      chatroomName: String(reqData.chatroomName),
      members: [reqData.owner],
    };

    // Chatroom collection creates a new document
    await Chatroom.create(convertReqData, async (err, data) => {
      if (err) {
        res.send({
          error: "Chatroom Cannot Be Created...",
        });
        throw err;
      }

      result.validCred = "true";
      result.chatroomCreated = data._id;

      // console.log("Chatroom Created...");

      // update user account's chatroom array if chatroom was created successfully
      await Account.findByIdAndUpdate(
        { _id: convertReqData.creatorOwnerID },
        // data._id is from the chatroom that was created. so after creating chatroom, it gives its ObjectId to Account
        { $push: { chatrooms: data._id } }
      )
        .then((res) => {
          // console.log("Account Updated Chatroom...");

          result.accountUpdateChatroom = "true";
          // console.log("res:", res);

          return res;
        })
        .catch((err) => {
          result.accountUpdateChatroom = "false";
          return err;
        });

      // console.log("result:", result);
      // send the entire result of the process since I cannot send res.send() multiple times
      res.send(result);
    });
  }

  return await createChatRoom();
};

module.exports = CreateChatroom;
