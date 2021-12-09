const Account = require("../models/AccountObject");

const LoginValidation = async (req, res) => {
  console.log("Inside Login Validation...");
  let reqData = req.body;

  // try {
  //   let account = await Account.findOne({ email: reqData.email, password: reqData.password }).then(user => user).catch(e => "account err")
  //   let account = await Account.findOne({ email: reqData.email, password: reqData.password }).then(user => user).catch(e => "account err")
  //   let account = await Account.findOne({ email: reqData.email, password: reqData.password }).then(user => user).catch(e => "account err")
  //   let account = await Account.findOne({ email: reqData.email, password: reqData.password }).then(user => user).catch(e => "account err")
  //   if (!account) {
  //     res.json({ validCred: "false" });
  //   }
  //   res.send({
  //     validCred: "true",
  //     username: data[0].username,
  //     owner: data[0]._id,
  //   });
  // } catch (e) {
  //   console.log(err);
  // }


  // finding the email that is being requested to create an account
  Account.find(
    { email: reqData.email, password: reqData.password },
    function (err, data) {
      if (err) {
        console.log(err);
        return err;
      }

      console.log("data[0]:", data[0]);

      if (data.length === 1 && data[0].confirmed === true) {
        res.send({
          validCred: "true",
          username: data[0].username,
          owner: data[0]._id,
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
