const mongoose = require('mongoose');

require('dotenv').config();

let URL = process.env.URL;

const dbConnect = () => {
    mongoose.connect(URL)
    .then(() => console.log("Connected to DB"))
    .catch((err) => console.log(err, "Error in Connecting to DB"))
}

module.exports = dbConnect;