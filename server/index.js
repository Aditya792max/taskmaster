const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");

require("dotenv").config();

const app  = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT;
app.listen(PORT , () => {
    console.log(`Server is Running on PORT : ${PORT}`);
});


mongoose.connect(process.env.MONGO).then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.log(err);
});


// After creating the APIs you route them here:
const devTaskRoutes = require("./Routes/DevTasksRoutes.js");
const studyTaskRoutes = require ("./Routes/StudyTasksRoutes.js");
const studyTaskDetails = require("./Models/StudyTasksDetails.js");
app.use("/",studyTaskRoutes);
app.use("/",devTaskRoutes);
