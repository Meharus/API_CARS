const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const commentRoutes = require("./api/routes/comments");
const carsRoutes = require("./api/routes/cars");
const userRoutes = require("./api/routes/users");

mongoose.connect("mongodb+srv://skowron:gaFOjtgUXd20v1G8@zajeciawsb-jlwsl.mongodb.net/test?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true });

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use("/cars", carsRoutes);
app.use("/users", userRoutes);
app.use("/comments",commentRoutes);

app.use((req, res, next)=> {
    const error = new Error("Nie znaleziono");
    error.status = 404;
    next(error);
});
app.use((error, req, res, next)=> {
    res.status(error.status || 500).json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;
