const mongoose = require("mongoose");

const carSchema = mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    comments: [
        {type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}
    ],
    name: String,
    model: String,
    capacity: Number,
    horsepower: Number,
});

module.exports = mongoose.model("Car", carSchema);