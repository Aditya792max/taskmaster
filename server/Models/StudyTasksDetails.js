const mongoose = require("mongoose");

const studyTasksSchema = new mongoose.Schema({
    Title: { type: String, required: true },
    Description: { type: String, required: true },
    Status: { type: Boolean, required: true },
    Priority: { type: Number, required: true }
}, {
    collection: "studyTaskDetails",
});

const studyTaskDetails = mongoose.model("studyTaskDetails", studyTasksSchema);
module.exports = studyTaskDetails;