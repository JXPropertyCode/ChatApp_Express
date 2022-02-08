const Account = require("../models/AccountObject");

const UserChatroomValidation = async (req, res) => {
  let reqData = req.body;
  // finding the email that is being requested to create an account
  const account = await Account.findOne({ email: reqData.email });

  if (!account) {
    res.send({ auth: false });
    return;
  }

  // searches the account chatroom for the request chatroom that the user wants to join
  for (let i = 0; i < account.chatrooms.length; i++) {
    if (reqData.reqChatroom === account.chatrooms[i]) {
      res.send({ auth: true });
      return;
    }
  }

  res.send({ auth: false });
  return;
};

module.exports = UserChatroomValidation;
