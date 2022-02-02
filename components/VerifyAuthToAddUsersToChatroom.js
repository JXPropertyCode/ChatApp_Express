const Account = require("../models/AccountObject");

const VerifyAuthToAddUsersToChatroom = (req, res) => {
  let reqData = req.body;

  // finding the email that is being requested to create an account
  Account.find({ email: reqData.email }, function (err, data) {
    if (err) {
      return err;
    }

    if (data.length === 1) {
      res.send({
        validCred: "true",
      });
    } else {
      res.send({ validCred: "false" });
      return;
    }
  });

  return;
};

module.exports = VerifyAuthToAddUsersToChatroom;
