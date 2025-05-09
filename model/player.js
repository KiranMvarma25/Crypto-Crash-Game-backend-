const mongoose = require('mongoose');

const playersSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    cryptoBalance: { type: Number, default: 0 },
    usdBalance: { type: Number, default: 0 },
});

module.exports = mongoose.model("Players", playersSchema);