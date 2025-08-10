const express = require('express');
const connectDB = require("./config/database");
const app = express();
const cookieParser = require("cookie-parser");
//const bcrypt = require("bcrypt");
const cors = require("cors");
require("dotenv").config();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
  }));
app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require('./routes/user');

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter)

connectDB().then(() => {
    console.log("Database connection established...");
    app.listen(process.env.PORT, () => {
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