const Account = require("../models/AccountObject");
const CryptoJS = require("crypto-js");

const LoginValidation = async (req, res) => {
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

  const decrypt = (input) => {
    // Decrypt
    var bytes = CryptoJS.AES.decrypt(input, process.env.CRYPTO_JS_SECRET_KEY);
    var originalText = bytes.toString(CryptoJS.enc.Utf8);

    return originalText;
  };

  // finding the email that is being requested to create an account
  Account.find(
    {
      email: reqData.email,
    },
    function (err, data) {
      if (err) {
        return err;
      }

      if (data.length === 0) {
        res.send({
          validCred: false,
        });
        return;
      }

      // comparing the db and input passwords
      // console.log("encrypt db pass:", data[0].password);
      // console.log("encrypt reqData.password:", reqData.password);

      const decryptDBPass = decrypt(data[0].password);
      const decryptReqPass = decrypt(reqData.password);

      if (data.length === 1 && decryptDBPass === decryptReqPass) {
        // console.log("Account Found:", reqData);

        if (data[0].confirmed === true) {
          res.send({
            validCred: "true",
            confirmed: "true",
            username: data[0].username,
            owner: data[0]._id,
          });
        } else {
          res.send({
            validCred: "true",
            confirmed: "false",
            username: data[0].username,
            owner: data[0]._id,
          });
        }
      } else {
        // if the passwords don't match then send invalid credentials
        res.send({ validCred: "false" });
      }
    }
  );
};

module.exports = LoginValidation;
