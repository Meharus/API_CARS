const mongoose = require("mongoose");

const commentSchema = mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    car: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Car'
    },
    title: String,
    userName: String,
    content: String
});

module.exports = mongoose.model("Comment", commentSchema);