const Account = require("../models/AccountObject");

const LoginValidation = (req, res) => {
  console.log("Inside Login Validation...");
  let reqData = req.body;

  // finding the email that is being requested to create an account
  Account.find(
    { email: reqData.email, password: reqData.password },
    function (err, data) {
      if (err) {
        console.log(err);
        return err;
      }

      console.log("data[0]:", data[0]);

      if (data.length === 1) {
        res.send({
          validCred: "true",
          username: data[0].username,
          userID: data[0]._id,
        });
        console.log("Account Found:", reqData);
      } else {
        // insert into MongoDB
        res.send({ validCred: "false" });
        console.log("Account NOT Found:", reqData);
      }
    }
  );
};

module.exports = LoginValidation;
