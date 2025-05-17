const express = require('express');
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");

app.use(express.json());

app.post("/signup", async (req, res) => {
    console.log(req.body);

    const user = new User(req.body);

    try {
        await user.save();
        res.send("User Added Successfully");
    } catch (err) {
        res.status(400).send("Error saving the user:" + err.message);
    }

});

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

app.patch("/user", async (req, res) => {
    const userId = req.body.userId;
    const data = req.body;
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