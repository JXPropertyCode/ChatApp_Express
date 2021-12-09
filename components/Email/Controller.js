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

  //   Account.findOne({ email })
  //     .then(user => {

  //       // We have a new user! Send them a confirmation email.
  //       if (!user) {
  //         Account.create({ email })
  //           .then(newUser => sendEmail(newUser.email, templates.confirm(newUser._id)))
  //           .then(() => res.json({ msg: msgs.confirm }))
  //           .catch(err => console.log(err))
  //       }

  //       // We have already seen this email address. But the user has not
  //       // clicked on the confirmation link. Send another confirmation email.
  //       else if (user && !user.confirmed) {
  //         sendEmail(user.email, templates.confirm(user._id))
  //           .then(() => res.json({ msg: msgs.resend }))
  //       }

  //       // The user has already confirmed this email address
  //       else {
  //         res.json({ msg: msgs.alreadyConfirmed })
  //       }

  //     })
  //     .catch(err => console.log(err))
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
