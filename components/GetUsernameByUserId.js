const Account = require("../models/AccountObject");

const GetUsernameByUserID = async (req, res) => {
  // console.log("Inside Get Username By User Id...");
  let reqData = req.body;
  // console.log("reqData:", reqData);

  let getUsername = await Account.find({
    _id: reqData.owner,
  })
    .then((data) => {
      // console.log("data[0]:", data[0]);
      res.send({ username: data[0].username });
    })
    .catch((err) => err);
};

module.exports = GetUsernameByUserID;
