const express   = require("express");
const router    = express.Router();
const mongoose  = require("mongoose");
const checkAuth = require("../middleware/check-auth");

const Comment = require("../models/comment");
const Car = require("../models/cars");

router.post("/", checkAuth, (req, res, next)=> {
    Car.findById(req.body.car).then((car) => {
        const comment = new Comment({
            _id: new mongoose.Types.ObjectId(),
           car: car._id,
           title: req.body.title,
           userName: req.body.userName,
           content: req.body.content
       });
       
       comment.save()
       .then(result => {
            car.comments.push(result);
            car.save().then(() => {
                res.status(200).json({
                    message: "Dodano nowy komentarz",
                    createdcomment: comment
                });
            });
       })
       .catch(err => res.status(500).json({error: err}));
    })
    
    
});

module.exports = router;