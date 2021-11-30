const Account = require("../models/AccountObject");

const ChangeUsername = (req, res) => {
  console.log("In Change Username...");
  console.log("req.body:", req.body);

  const reqData = req.body;

  Account.findByIdAndUpdate(
    { _id: reqData.userID, email: reqData.email, password: reqData.password },
    { username: reqData.newUsername }
  )
    .then((res) => console.log("res:", res))
    .catch((err) => console.log("err:", err));
};

module.exports = ChangeUsername;
