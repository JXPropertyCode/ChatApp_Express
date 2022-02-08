const Account = require("../models/AccountObject");

const Signup = async (req, res) => {
  let reqData = req.body;

  let convertReqData = {
    chatrooms: new Array(...reqData.chatrooms),
    username: String(reqData.username),
    email: String(reqData.email),
    password: String(reqData.password),
  };

  // // finding the email that is being requested to create an account
  // Account.find({ email: reqData.email }, function (err, data) {
  //   if (err) {
  //     return err;
  //   }

  //   if (data.length > 0) {
  //     res.send({ validCred: "false" });
  //   } else {
  //     res.send({ validCred: "true" });

  //     // insert into MongoDB
  //     Account.create(convertReqData, function (err) {
  //       if (err) throw err;
  //     });
  //   }
  // });

  // finding the email that is being requested to create an account
  const account = await Account.findOne({ email: reqData.email });

  // if account is already created, it is invalid to create another one
  if (account) {
    res.send({ validCred: "false", result: account });
    return;
  }

  res.send({ validCred: "true" });

  // insert into MongoDB
  const createAccount = await Account.create(
    convertReqData,
    function (err, data) {
      if (err) throw err;
      console.log("data:", data);
      return data;
    }
  );
};

module.exports = Signup;
