const express = require('express');
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require("bcrypt");

app.use(express.json());

app.post("/signup", async (req, res) => {
    try {
        validateSignUpData(req);

        const {firstName, lastName, emailId, password} = req.body;

        const passwordHash = await bcrypt.hash(password, 10);
        console.log(passwordHash);
        const user = new User({
            firstName,
            lastName,
            emailId,
            password: passwordHash
        });

    
        await user.save();
        res.send("User Added Successfully");
    } catch (err) {
        res.status(400).send("Error : " + err.message);
    }

});

app.post("/login", async (req, res) => {
    try {
        const { emailId, password } = req.body;

        const user = await User.findOne({ emailId: emailId});

        if(!user) {
            throw new Error("Invalid Credentials.")
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if(isPasswordValid) {
            res.send("Login Successful!!!");
        }
        else {
            throw new Error("Invalid Credentials.");
        }
    } catch (err) {
        res.status(400).send("Error : " + err.message);
    }
})

app.get("/user", async (req, res) => {
    const userEmail = req.body.emailId;
    try {
        console.log(userEmail);
        const users = await User.findOne({ emailId: userEmail });
        if (!users) {
            res.status(404).send("User Not Found");
        } else {
            res.send(users);
        }
        
    }
    catch (err) {
        res.status(400).send("Something went wrong");
    }
});

app.get("/feed", async (req, res) => {
    try {
        const users = await User.find({});
        res.send(users);
    } catch (err) {
        res.status(400).send("Something went wrong");
    }
});

app.delete("/user", async(req, res) => {
    const userId = req.body.userId;

    try {
        const user = await User.findByIdAndDelete({_id: userId});
        res.send("User deleted Successfully");
    } catch (err) {
        res.status(400).send("Something went wrong ");
    }

});

app.patch("/user/:userId", async (req, res) => {
    const userId = req.params?.userId;
    const data = req.body;

    const ALLOWED_UPDATES = [
        "userId","photoUrl", "about", "gender", "age", "skills"
    ];

    const isUpdateAllowed = Object.keys(data).every(k => ALLOWED_UPDATES.includes(k));

    if(!isUpdateAllowed) {
        res.status(400).send("Update Not Allowed")
    }

    if(data?.skills.length > 10) {
        throw new Error("Skills cannot be more than 10")
    }
    try {
        const user = await User.findByIdAndUpdate({ _id: userId }, data, {returnDocument: "after", runValidators: true});
        console.log(user);
        res.send("User Updated Successfully");
    } catch (err) {
        res.status(400).send("UPDATE FAILED: " + err.message);
    }
})



connectDB().then(() => {
    console.log("Database connection established...");
    app.listen(3000, () => {
        console.log("Server is successfully running on port 3000");
    });
}).catch(err => {
    console.error("Database cannot be established");
})

// const {adminAuth, userAuth} = require("./middlewares/auth");

// app.use("/admin", adminAuth);

// app.use("/user", (req, res, next) => {
//     console.log("Handling the route user");
//     //res.send("Response");
//     next();
//     res.send("Response");
// }, (req, res) => {
//     console.log("Handling the route user 2");
//     res.send("2nd Response");
// })

// app.get("/user", userAuth , (req, res) => {
//     res.send("User Data Sent");
// });

// app.use("/", (err, req, res, next) => {
//     if(err) {
//         res.status(500).send("Something went wrong");
//     }
// })

// it will work with abc, ac
// app.get("/user/ab?c", (req, res) => {
//     res.send({firstname: "Shivam", lastName: "Mittal"});
// })

// app.use("/test", (req, res) => {
//     res.send("Hello from the server 3!");
// });