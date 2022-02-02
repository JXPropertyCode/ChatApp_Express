const Chatroom = require("../models/ChatroomObject");

const Chatrooms = (req, res) => {
  // this gets all the data from MongoDB and outputs it onto the local host
  Chatroom.find({}, function (err, data) {
    if (err) {
      return err;
    } else {
      res.json(data);
    }
  });
};

module.exports = Chatrooms;
