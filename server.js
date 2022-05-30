/////////////////////////////////////////////////////////////////////
//DEPENDENCIES
/////////////////////////////////////////////////////////////////////
//GET .ENV VARIABLES
require("dotenv").config();
//PULL PORT FROM .ENV, GIVE DEFAULT VALUE OF 3001
const { PORT = 3001, DATABASE_URL } = process.env;
//IMPORT EXPRESS
const express = require("express");
//CREATE APPLICATION OBJECT
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");

/////////////////////////////////////////////////////////////////////
//DATABASE CONNECTION
/////////////////////////////////////////////////////////////////////
//ESTABLISH CONNECTION
mongoose.connect(DATABASE_URL)
//CONNECTION EVENTS
mongoose.connection
    .on("open", () => console.log("MongoDB connected"))
    .on("close", () => console.log("MongoDB disconnected"))
    .on("error", (error) => console.log(error))

/////////////////////////////////////////////////////////////////////
//MODELS
/////////////////////////////////////////////////////////////////////
const PeopleSchema = new mongoose.Schema({
    name: String,
    image: String,
    title: String
})

const People = mongoose.model("People", PeopleSchema)

/////////////////////////////////////////////////////////////////////
//MIDDLEWARE
/////////////////////////////////////////////////////////////////////
app.use(cors()) //to prevent cors error, open access to all origins
app.use(morgan("dev"))  //logging
app.use(express.json()) //parse json bodies


/////////////////////////////////////////////////////////////////////
//ROUTES
/////////////////////////////////////////////////////////////////////
//CREATE A TEST ROUTE
app.get("/", (req, res) => {
    res.send("hello world")
})

//People Index Route
app.get("/people", async (req, res) => {
    try {
        //send all people
        res.json(await People.find({}))
    } catch (error) {
        //send error
        res.status(400).json(error)
    }
})

//PEOPLE CREATE ROUTE
app.post("/people", async (req, res) => {
    try {
        res.json(await People.create(req.body))
    } catch (error) {
        //send error
        res.status(400).json(error)
    }
})

//PEOPLE DELETE ROUTE
app.delete("/people/:id", async (req, res) => {
    try {
        //send all people
        res.json(await People.findByIdAndDelete(req.params.id))
    } catch (error) {
        res.status(400).json(error)
    }
})


//PEOPLE UPDATE ROUTE 
app.put('/people/:id', async (req, res) => {
    try {
        //send all people
        res.json(
            await People.findByIdAndUpdate(req.params.id, req.body, { new: true})
        )
    } catch (error) {
        //send error
        res.status(400).json(error)
    }
})



/////////////////////////////////////////////////////////////////////
//LISTENER
/////////////////////////////////////////////////////////////////////
app.listen(PORT, () => console.log(`They're listening on port ${PORT}`))