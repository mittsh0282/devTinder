const express = require('express');
const app = express();
const authRouter = express.Router();
const bcrypt = require("bcrypt");
const { validateSignUpData } = require("../utils/validation");
const User = require("../models/user");
//const jwt = require("jsonwebtoken");

authRouter.post("/signup", async (req, res) => {
    try {
        validateSignUpData(req);

        const { firstName, lastName, emailId, password } = req.body;

        const passwordHash = await bcrypt.hash(password, 10);
        console.log(passwordHash);
        const user = new User({
            firstName,
            lastName,
            emailId,
            password: passwordHash
        });


        const savedUser = await user.save();
        const token = await savedUser.getJWT();

        res.cookie("token", token, {
            expires: new Date(Date.now() + 8*3600000)
        });
        res.json({message: "User Added Successfully", data: savedUser});
    } catch (err) {
        res.status(400).send("Error : " + err.message);
    }

});

authRouter.post("/login", async (req, res) => {
    try {
        const { emailId, password } = req.body;

        const user = await User.findOne({ emailId: emailId });
        console.log(user);

        if (!user) {
            throw new Error("Invalid Credentials.")
        }

        
        const isPasswordValid = await user.validatePassword(password);

        if (isPasswordValid) {
            // Create a JWT Token

            // const token = await jwt.sign({ _id: user._id }, "DEV@TINDER$790", {
            //     expiresIn: "7d"
            // });

            const token = await user.getJWT();
            console.log(token);

            // Add the token to cookie and send the response back to the user

            res.cookie("token", token, {
                expires: new Date(Date.now() + 8 * 3600000)
            });
            res.send(user);


        }
        else {
            throw new Error("Invalid Credentials.");
        }
    } catch (err) {
        res.status(400).send("Error : " + err.message);
    }
});

authRouter.post("/logout", async (req, res) => {
    res.cookie("token", null, {
        expires: new Date(Date.now())
    });

    res.send("User is Logged Out")
});



module.exports = authRouter;