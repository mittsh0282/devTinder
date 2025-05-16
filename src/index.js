const express = require('express');
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");

app.post("/signup", async (req, res) => {
    const user = new User({
        firstName: "Rohit",
        lastName: "Sharma",
        emailId: "rohit@gmail.com",
        password: "rohit@123"
    });

    try {
        await user.save();
        res.send("User Added Successfully");
    } catch(err) {
        res.status(400).send("Error saving the user:" + err.message);
    }
})

connectDB().then(() => {
    console.log("Database connection established...");
    app.listen(3000, () => {
        console.log("Server is successfully running on port 3000");
    });
}).catch(err=>{
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