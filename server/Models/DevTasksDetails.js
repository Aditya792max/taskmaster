const mongoose = require("mongoose");

const devTasksSchema = new mongoose.Schema({
    Title: { type: String, required: true },
    Description: { type: String, required: true },  // FIXED
    Status: { type: Boolean, required: true },      // FIXED
    Priority: { type: Number, required: true },     // FIXED
    deadline: { type: String, required: true },
}, {
    collection: "devTaskDetails",
});

const devTaskDetails = mongoose.model("devTaskDetails", devTasksSchema);
module.exports = devTaskDetails;