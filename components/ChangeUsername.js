const Account = require("../models/AccountObject");

const ChangeUsername = (req, res) => {
  console.log("In Change Username...");
  console.log("req.body:", req.body);

  const reqData = req.body;

//   Account.find(
//     { _id: reqData.userID, email: reqData.email, password: reqData.password },
//     function (err, data) {
//       if (err) {
//         throw err;
//       }
//       console.log("Data Found:", data);
//     }

    Account.findByIdAndUpdate(
        { _id: reqData.userID, email: reqData.email, password: reqData.password },
        { username:  reqData.newUsername}
    )
        .then((res) => console.log("res:", res))
        .catch((err) => console.log("err:", err));

//   Account.findByIdAndUpdate(
//       { _id: convertReqData.creatorUserID },
//       { $push: { chatrooms: data._id } }
//   )
//       .then((res) => console.log("res:", res))
//       .catch((err) => console.log("err:", err));
};

module.exports = ChangeUsername;
