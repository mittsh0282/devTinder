const express = require('express');
const { userAuth } = require('../middlewares/auth');

const requestRouter = express.Router();

requestRouter.post("/sendConnectionRequest", userAuth, async (req, res) => {
    const user = req.user;

    console.log("Sending a Connection Request");

    res.send(user.firstName + "sent the connect request");
})

module.exports = requestRouter;