const Account = require("../models/AccountObject");

const ChangeUsername = async (req, res) => {
  const reqData = req.body;

  let result = {};

  await Account.findByIdAndUpdate(
    { _id: reqData.owner, email: reqData.email },
    { username: reqData.newUsername, $set: { lastModified: Date.now() } }
  )
    .then((res) => {
      // console.log("res:", res);
      result.message = "Change Username Successful";
      return res;
    })
    .catch((err) => {
      // console.log("err:", err);
      result.message = "Change Username Failed";
      return err;
    });

  res.send(result);
};

module.exports = ChangeUsername;
