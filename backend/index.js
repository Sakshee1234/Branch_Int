const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require('mongoose')
const jwt = require("jsonwebtoken")
const JWT_SECRET = "asdfghjnbvcxsrtyuiopppjhgcxm/poiuytrewqasdfghjlmnbvcx/poiuytrewqafghjklmnbvcxz";
const connectDB = require('./config/db');
const cookieParser = require("cookie-parser");
const port = process.env.PORT || 5000
connectDB();

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

require("./models/users");
const User = mongoose.model("User");

//signin
app.post('/signin', async (req, res) => {
    const {uname,password}=req.body;

    const user = await User.findOne({ email });

    if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
    return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' }); // 7 days, for example
    res.cookie("token", token, {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
    
    res.json({ token, username: user.name});
});

app.listen(4000, () => { 
    console.log("Server is Running"); 
})

// Sakshee