const Account = require("/Users/johnnyxian/Desktop/ReactProjects/chat-app-project/chat-react-express-app/chat-express-app/models/AccountObject.js");
const sendEmail = require("./SendEmail");
const msgs = require("./Message");
const templates = require("./TemplateEmail");

// The callback that is invoked when the user submits the form on the client.
exports.collectEmail = (req, res) => {
  console.log("In Collect Email...");
  console.log("req.body:", req.body);

  const { email } = req.body;

  Account.findOne({ email: email })
    .then((user) => {
      console.log("user found:", user);

      if (user.confirmed === false) {
        sendEmail(user.email, templates.confirm(user._id));
      }
    })
    .catch((err) => console.log(err));
};

exports.confirmEmail = (req, res) => {
  const { id } = req.params;

  console.log("In Confirm Email...");

  console.log("req.params:", req.params);

  Account.findById({ _id: id })
    .then((user) => {
      // A user with that id does not exist in the DB. Perhaps some tricky
      // user tried to go to a different url than the one provided in the
      // confirmation email.
      if (!user) {
        res.send({ msg: msgs.couldNotFind });
      }

      // The user exists but has not been confirmed. We need to confirm this
      // user and let them know their email address has been confirmed.
      else if (user && !user.confirmed) {
        Account.findByIdAndUpdate({ _id: id }, { $set: { confirmed: true } })
          .then((res) => res.send({ msg: msgs.confirmed }))
          .catch((err) => console.log(err));
      }

      // The user has already confirmed this email address.
      else {
        res.send({ msg: msgs.alreadyConfirmed });
      }
    })
    .catch((err) => console.log(err));
};

// confirmation of change email
exports.changeEmail = (req, res) => {
  // console.log("In Controller Change Email...");
  // console.log("req.body:", req.body);
  const { email } = req.body;

  Account.findOne({ email: email })
    .then((user) => {
      // console.log("user found:", user);

      sendEmail(user.email, templates.changeEmail(user._id));
    })
    .catch((err) => console.log(err));

  // Account.findByIdAndUpdate(
  //   { _id: reqData.owner },
  //   { $set: { email: reqData.newEmail } }
  // )
  //   .then((res) => console.log("res:", res))
  //   .catch((err) => console.log("err:", err));
};

// after submitting old and new password it would activate this
exports.confirmChangeEmail = (req, res) => {
  // console.log("In Controller Confirm Change Email...");
  // console.log("req.body:", req.body);

  const reqData = req.body

  Account.findByIdAndUpdate(
    { _id: reqData.owner },
    { $set: { email: reqData.newEmail } }
  )
    .then((res) => console.log("res:", res))
    .catch((err) => console.log("err:", err));
};

exports.changePassword = (req, res) => {
  // console.log("In Controller Change Password...");
  // console.log("req.body:", req.body);

  const { email } = req.body;

  // console.log("Currently Inactive...");

  Account.findOne({ email: email })
    .then((user) => {
      console.log("user found:", user);

      sendEmail(user.email, templates.changePassword(user._id));
    })
    .catch((err) => console.log(err));
  // Account.findByIdAndUpdate(
  //   { _id: reqData.owner },
  //   { $set: { email: reqData.newEmail } }
  // )
  //   .then((res) => console.log("res:", res))
  //   .catch((err) => console.log("err:", err));
};

exports.confirmChangePassword = (req, res) => {
  // console.log("In Controller Confirm Change Password...");
  // console.log("req.body:", req.body);

  const reqData = req.body;

  // console.log("Currently Inactive...")

  Account.findByIdAndUpdate(
    { _id: reqData.owner },
    { $set: { password: reqData.newPassword } }
  )
    .then((res) => console.log("res:", res))
    .catch((err) => console.log("err:", err));
};

// The callback that is invoked when the user visits the confirmation
// url on the client and a fetch request is sent in componentDidMount.
// exports.confirmEmail = (req, res) => {
//   const { id } = req.params

//   Account.findById(id)
//     .then(user => {

//       // A user with that id does not exist in the DB. Perhaps some tricky
//       // user tried to go to a different url than the one provided in the
//       // confirmation email.
//       if (!user) {
//         res.json({ msg: msgs.couldNotFind })
//       }

//       // The user exists but has not been confirmed. We need to confirm this
//       // user and let them know their email address has been confirmed.
//       else if (user && !user.confirmed) {
//         Account.findByIdAndUpdate(id, { confirmed: true })
//           .then(() => res.json({ msg: msgs.confirmed }))
//           .catch(err => console.log(err))
//       }

//       // The user has already confirmed this email address.
//       else  {
//         res.json({ msg: msgs.alreadyConfirmed })
//       }

//     })
//     .catch(err => console.log(err))
// }
