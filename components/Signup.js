const Account = require("../models/AccountObject");

const Signup = (req, res) => {
  let reqData = req.body;

  let convertReqData = {
    chatrooms: new Array(...reqData.chatrooms),
    username: String(reqData.username),
    email: String(reqData.email),
    password: String(reqData.password),
  };

  // finding the email that is being requested to create an account
  Account.find({ email: reqData.email }, function (err, data) {
    if (err) {
      return err;
    }

    if (data.length > 0) {
      res.send({ validCred: "false" });
    } else {
      res.send({ validCred: "true" });

      // insert into MongoDB
      Account.create(convertReqData, function (err) {
        if (err) throw err;
      });
    }
  });
};

module.exports = Signup;
