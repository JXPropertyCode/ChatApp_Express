const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.REACT_APP_GOOGLE_CLIENT_ID);
const Account = require("../models/AccountObject");
const Signup = require("./SignUp");

// const upsert = () => {
// find email in database, if cannot find then insert it
// };

// need to see if the user exists in the database
// if exist, provide the information from the database such as chatrooms and messages and etc
// if doesn't exist, create a new account in the DB
// then next step is to change React to put information onto its authSlice and etc
// but for now I will focus on more backend stuff to make sure it works first

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
      // , password: reqData.password
    },
    function (err, data) {
      if (err) {
        // console.log(err);
        return err;
      }
      if (data.length === 1) {
        // data[0].confirmed === true;
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
        // res.send({ validCred: "false" });

        // i might be able to use Signup.js since what i'm doing here is the same as that
        // except I wrote it separately for now without intergrating it until I find that everything works
        let convertReqData = {
          chatrooms: new Array(),
          username: String(name),
          email: String(email),
          googleId: String(sub),
          confirmed: Boolean(true)

          // password: String(reqData.password),
          // lastModified: String(reqData.lastModified),
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
