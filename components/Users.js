const User = require("../models/AccountObject");

const Users = (req, res) => {
  // this gets all the data from MongoDB and outputs it onto the local host
  User.find({}, function (err, data) {
    if (err) {
      return err;
    } else {
      res.json(data);
    }
  });
};

module.exports = Users;
