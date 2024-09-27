const express = require("express");
const app = express();

app.use("/", (req, res, next) => { 
    res.send("express server"); 
}) 

app.get("/hello", (req, res, next) => { 
    res.send("hello response"); 
}) 

app.listen(4000, () => { 
    console.log("Server is Running"); 
})