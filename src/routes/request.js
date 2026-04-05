const express = require("express");
const requestRouter = express.Router();
const mongoose = require("mongoose");
const {userAuth} = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const {userModel} = require("../models/user");

//const sendEmail = require("../utils/sendEmail");

// By using userAuth middleware the sendConnectionRequest API works well!!
requestRouter.post("/sendRequest", userAuth, async (req,res) => {

    try{   
        res.send(req.userInfo.firstName+ " has sent the request!");
    } catch(err){
        res.status(400).send("ERROR : "+err.message);
    }

});


requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.userInfo._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      const allowedStatus = ["ignored", "interested"];
      if (!allowedStatus.includes(status)) {
        return res
          .status(400)
          .json({ message: "Invalid status type: " + status });
      }

      if (!mongoose.Types.ObjectId.isValid(toUserId)) {
        return res.status(400).json({ message: "Invalid User ID" });
    }

      const toUser = await userModel.findById({_id : toUserId });

      if (!toUser) {
        return res.status(404).json({ message: "User not found!" });
      }

      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      if (existingConnectionRequest) {
        return res
          .status(400)
          .send({ message: "Connection Request Already Exists!!" });
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequest.save();

      // const emailRes = await sendEmail.run(
      //   "A new friend request from " + req.user.firstName,
      //   req.user.firstName + " is " + status + " in " + toUser.firstName
      // );
      // console.log(emailRes);

      res.json({
        message:`${req.userInfo.firstName} is ${status} in ${toUser.firstName}`,
        data,
      });
    } catch (err) {
      res.status(400).send("ERROR: " + err.message);
    }
  }
);

requestRouter.post("/request/review/:status/:requestId",
    userAuth,
    async (req, res) => {
      try {
        const loggedInUser = req.userInfo;
        const { status, requestId } = req.params;
  
        const allowedStatus = ["accepted", "rejected"];
        if (!allowedStatus.includes(status)) {
          return res.status(400).json({ messaage: "Status not allowed!" });
        }
  
        const connectionRequest = await ConnectionRequest.findOne({
          _id: requestId,
          toUserId: loggedInUser._id,
          //status: "not interested",
        });
        if (!connectionRequest) {
          return res
            .status(404)
            .json({ message: "Connection request not found" });
        }
  
        connectionRequest.status = status;
  
        const data = await connectionRequest.save();
  
        res.json({ message: "Connection request " + status, data });
      } catch (err) {
        res.status(400).send("ERROR: " + err.message);
      }
    }
  );





module.exports = {requestRouter};
