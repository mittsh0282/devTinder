const express = require("express");

const profileRouter = express.Router();
const { validateEditProfileData } = require("../utils/validation");
const { userAuth } = require("../middlewares/auth");


profileRouter.get("/profile", userAuth, async (req, res) => {
    try {
        
        const user = req.user;

        if(!user) {
            throw new Error("User does not exist");
        }
        res.send(user);
    } catch (err) {
        res.status(400).send("Error : " + err.message);
    }
});


profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
    try {
        if(!validateEditProfileData(req)) {
            throw new Error("Invalid Edit Request");
        }

        const loggedInUser = req.user;
        
        Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));

        loggedInUser.save();

        res.send({
            message: `${loggedInUser.firstName}, your Profile updated successfully`,
            data: loggedInUser
        });
    } catch (err) {
        res.status(400).send("ERROR : " + err);
    }
})

module.exports = profileRouter;