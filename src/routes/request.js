const express = require('express');
const { userAuth } = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');
const User = require("../models/user");

const requestRouter = express.Router();

requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
    try {
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        const allowedStatus = ["ignored", "interested"];
        if(!allowedStatus.includes(status)) {
            return res.status(400).json({
                message: "Invalid Status Type: " + status
            });
        }

        const toUser = await User.findById(toUserId);
        if(!toUser) {
            return res.status(404).json({
                message: "User Not Found"
            })
        }
        // If there is an existing Connection Request
        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId }
            ]
        });

        if(existingConnectionRequest) {
            return res.status(400).send({message: "Connection Request already Exists !!"})
        }

        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        });
        console.log("connection req ", connectionRequest)

        const data = await connectionRequest.save();

        res.json({
            message: req.user.firstName + " is " + status + " by " + toUser.firstName,
            data
        });
    } catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }
})

module.exports = requestRouter;