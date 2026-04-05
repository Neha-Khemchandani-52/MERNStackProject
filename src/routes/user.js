const express = require("express");
const userRouter = express.Router();

module.exports = {userRouter};

const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const {userModel} = require("../models/user");

const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills";


// Get all the pending connection request for the loggedIn user
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
    try {
      const loggedInUser = req.userInfo;
  
      const connectionRequests = await ConnectionRequest.find({
        toUserId: loggedInUser._id,
        status: "interested", // pending requests only
      }).populate("fromUserId", USER_SAFE_DATA); // to fetch required fields from joined table
      // }).populate("fromUserId", ["firstName", "lastName"]);
  
      res.json({
        message: "Data fetched successfully",
        data: connectionRequests,
      });
    } catch (err) {
      req.statusCode(400).send("ERROR: " + err.message);
    }
  });

  userRouter.get("/user/connections", userAuth, async (req, res) => {
    try {
      const loggedInUser = req.userInfo;
  
      const connectionRequests = await ConnectionRequest.find({
        $or: [
          { toUserId: loggedInUser._id, status: "accepted" },
          { fromUserId: loggedInUser._id, status: "accepted" },
        ],
      })
        .populate("fromUserId", USER_SAFE_DATA)
        .populate("toUserId", USER_SAFE_DATA);
  
      const data = connectionRequests.map((row) => {
        if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
          return row.toUserId;
        }
        return row.fromUserId;
      });
  
      res.json({ data });
    } catch (err) {
      res.status(400).send({ message: err.message });
    }
  });

  // most imporant API
  /***
   * user should not see his own suggestion card in feed
   * If this user `A` is already connected(accepted) to some user `B`, then user `B` should not be come in feed of user `A`
   * Ignored people should not come in feed
   * Already sent connection requests, should not come in feed
   * Already Rejected requestes, should not come in feed
   */
  
  userRouter.get("/user/feed", userAuth, async (req, res) => {  ///user/feed?page=1&limit=10
    try {
      const loggedInUser = req.userInfo;
  
      const page = parseInt(req.query.page) || 1;
      let limit = parseInt(req.query.limit) || 10;
      limit = limit > 50 ? 50 : limit; // restrict user, as user can send any limit let's say 1 lac then it would hang our DB & application server
      const skip = (page - 1) * limit;

      // findout all connection requests that either I have sent or received
      const connectionRequests = await ConnectionRequest.find({
        $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
      }).select("fromUserId  toUserId");
  
      // These people, I want to hide from my feed
      const hideUsersFromFeed = new Set(); // list of unique elements, here users
      connectionRequests.forEach((req) => {
        hideUsersFromFeed.add(req.fromUserId.toString());
        hideUsersFromFeed.add(req.toUserId.toString());
      });
  
      // so here I am finding people who are not in hide set 'hideUsersFromFeed' and also my own suggestion in feed
      const users = await userModel.find({
        $and: [
          { _id: { $nin: Array.from(hideUsersFromFeed) } }, // converting set into array (nin => not in this aaray)
          { _id: { $ne: loggedInUser._id } }, // (ne => should not be equal to self, means should not see yourslef in the feed)
        ],
      })
        .select(USER_SAFE_DATA)
        .skip(skip) // by default skip is 0
        .limit(limit); // by defualt it will return all documents
  
      res.json({ data: users });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });