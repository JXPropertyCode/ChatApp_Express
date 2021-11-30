const Message = require("../models/MessageObject");

// // path varaiable
// http://www.livechat.com/chatroom/roomId123/userid123
// route("/chatroom/:roomId/:userId").(req,res) => {
// 	req.params['roomId'] // roomId123
// 	req.params['userId'] // userid123
// }

// // path params // path query
// http://www.livechat.com?chatroomid=roomId123&userId=userId123
// route("/chatroom").(req,res) => {
// 	req.query['chatroomid'] // roomId123
// 	req.query['userId'] // userid123
// }

const Messages = (req, res) => {
  // get the parameters of the url
  console.log("req.query.roomid:", req.query.roomid);
  // this gets only the chatroom data from MongoDB after filtering the messageCollection and outputs it onto the local host
  Message.find({ roomID: req.query.roomid }, function (err, data) {
    if (err) {
      console.log("err:", err);
    } else {
      // console.log("Data from MongoDB:", data);
	  console.log("Data Found in req.query.roomid:", data)
      return res.json(data);
    }
  });
};

module.exports = Messages;
