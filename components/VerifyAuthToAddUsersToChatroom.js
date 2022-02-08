const Account = require("../models/AccountObject");

const VerifyAuthToAddUsersToChatroom = async (req, res) => {
  let reqData = req.body;

  // finding the email that is being requested to create an account
  const verifyAccount = await Account.findOne({ email: reqData.email });

  // console.log("verifyAccount:", await verifyAccount);

  if (!verifyAccount) {
    res.send({ validCred: "false" });
  } else {
    res.send({
      validCred: "true",
    });
  }

  return;
};

module.exports = VerifyAuthToAddUsersToChatroom;
