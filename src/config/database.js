const mongoose = require("mongoose");

const connectDB = async () => {
    await mongoose.connect(
        "mongodb+srv://NamasteNode:YvaB8zXVOIdqAMr1@namastenode.cdtyhr0.mongodb.net/devTinder"
    );
};

module.exports = connectDB;

connectDB().then(() => {
    console.log("Database connection established...");
}).catch(err=>{
    console.error("Database cannot be established");
})

