const Message = require("../models/MessageObject");

// // path varaiable
// http://www.livechat.com/chatroom/roomId123/owner123/
// route("/chatroom/:room/:owner").(req,res) => {
// 	req.params['room'] // roomId123
// 	req.params['owner'] // owner123
// }

// // path params // path query
// http://www.livechat.com?chatroomId=roomId123&owner=owner123
// route("/chatroom").(req,res) => {
// 	req.query['chatroomId'] // roomId123
// 	req.query['owner'] // owner123
// }

const Messages = (req, res) => {
  // get the parameters of the url
  // console.log("req.query.room:", req.query.room);
  // this gets only the chatroom data from MongoDB after filtering the messageCollection and outputs it onto the local host
  Message.find({ room: req.query.room }, function (err, data) {
    if (err) {
      // console.log("err:", err);
      return err
    } else {
      // console.log("Data Found in req.query.room:", data);
      return res.json(data);
    }
  }).populate("owner");
};

module.exports = Messages;
