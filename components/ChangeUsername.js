const Account = require("../models/AccountObject");

const ChangeUsername = (req, res) => {
  const reqData = req.body;

  Account.findByIdAndUpdate(
    { _id: reqData.owner, email: reqData.email },
    { username: reqData.newUsername, $set: { lastModified: Date.now() } }
  )
    .then((res) => res)
    .catch((err) => res);
};

module.exports = ChangeUsername;
