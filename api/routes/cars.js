const express   = require("express");
const router    = express.Router();
const mongoose  = require("mongoose");
const checkAuth = require("../middleware/check-auth");

const Car = require("../models/cars");

router.get("/", (req, res, next)=> {
    Car.find().populate("comments").exec()
    .then(docs=> {
        res.status(200).json(docs);
    })
    .catch(err => res.status(500).json({error: err}));
    
});

router.post("/", checkAuth, (req, res, next)=> {
    const car = new Car({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        model: req.body.model,
        capacity: req.body.capacity,
        horsepower: req.body.horsepower

    });
    car.save()
    .then(result => {
        res.status(200).json({
            message: "Dodano nowy samochód",
            createdcar: car
        });
    })
    .catch(err => res.status(500).json({error: err}));
    
});

router.get("/get/:carId", (req, res, next)=> {
    const id = req.params.carId;
    Car.findById(id).exec()
    .then(doc => {
        res.status(200).json(doc);
    })
    .catch(err => res.status(500).json({error: err}));

    
});
router.get("/carSearch", (req, res, next)=> {
    const name = req.query.name;
    const model = req.query.model;
    const SearchParams = {};

    if (name) {

        SearchParams.name = new RegExp(name, 'i');
    }
        
    if (model) {
        SearchParams.model = new RegExp(model, 'i');

    }
    
    Car.find(SearchParams).exec()
    .then(doc => {
        res.status(200).json(doc);
    })
    .catch(err => res.status(500).json({error: err}));

    
});

router.patch("/:carId", (req, res, next)=> {
    const id = req.params.carId;
    Car.update({_id:id}, { $set: {
        name: req.body.name,
        model: req.body.model,
        capacity: req.body.capacity,
        horsepower: req.body.horsepower
    }}).exec()
    .then(result=> {
        res.status(200).json({message: "Zmiana informacji samochodu o numerze ID " + id});
    })
    .catch(err => res.status(500).json({error: err}));

    
});

router.delete("/:carId", (req, res, next)=> {
    const id = req.params.carId;
    Car.remove({_id: id}).exec()
    .then(result=> {
        res.status(200).json({message: "Usunięcie samochodu o numerze ID " + id});
    })
    .catch(err => res.status(500).json({error: err}));
    
});

module.exports = router;