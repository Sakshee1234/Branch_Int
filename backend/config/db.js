const mongoose = require('mongoose');

const connectDB = async () => {
    const uri = "mongodb+srv://Sakshi:Sakshee@cluster0.djjm6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

    mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
        console.log("MONGO Connected ")
    }).catch((err) => {
        console.log(err)
    })
}

module.exports = connectDB