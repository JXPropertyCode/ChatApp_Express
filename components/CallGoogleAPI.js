const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.REACT_APP_GOOGLE_CLIENT_ID);
const Account = require("../models/AccountObject");

async function CallGoogleAPI(req, res) {
  const { token } = req.body;
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.CLIENT_ID,
  });

  // get the users information
  const { name, email, sub } = ticket.getPayload();
  console.log("ticket.getPayload():", ticket.getPayload());
  console.log("name:", name);
  console.log("email:", email);
  console.log("googleId:", sub);

  // finding the email that is being requested to create an account
  Account.find(
    {
      email: email,
    },
    function (err, data) {
      if (err) {
        return err;
      }
      if (data.length === 1) {
        console.log("Account Found:", data[0]);

        if (data[0].confirmed === true) {
          res.send({
            validCred: "true",
            confirmed: "true",
            username: data[0].username,
            owner: data[0]._id,
            email: data[0].email,
          });
        } else {
          res.send({
            validCred: "true",
            confirmed: "false",
            username: data[0].username,
            owner: data[0]._id,
            email: data[0].email,
          });
        }
      } else {
        // insert into MongoDB
        let convertReqData = {
          chatrooms: new Array(),
          username: String(name),
          email: String(email),
          googleId: String(sub),
          confirmed: Boolean(true),
        };

        Account.create(convertReqData, function (err, data) {
          if (err) throw err;

          console.log("data:", data);

          res.send({
            validCred: "true",
            confirmed: "true",
            username: name,
            email: email,
            owner: data._id,
          });
        });
      }
    }
  );
  return;
}

module.exports = CallGoogleAPI;
