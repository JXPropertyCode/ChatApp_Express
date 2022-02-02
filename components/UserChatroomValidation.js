const Account = require("../models/AccountObject");

const UserChatroomValidation = (req, res) => {
  let reqData = req.body;

  // finding the email that is being requested to create an account
  Account.find({ email: reqData.email }, function (err, data) {
    if (err) {
      return err;
    }

    if (data.length === 0) {
      res.send({ auth: false });
      return;
    }

    for (let i = 0; i < data[0].chatrooms.length; i++) {
      if (reqData.reqChatroom === data[0].chatrooms[i]) {
        res.send({ auth: true });

        return;
      }
    }

    res.send({ auth: false });
    return;
  });
};

module.exports = UserChatroomValidation;
