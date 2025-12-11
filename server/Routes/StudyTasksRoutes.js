const express = require("express");
const studyTaskDetails = require("../Models/StudyTasksDetails");
const router = express.Router();

// GET API - fetch all study tasks
router.get("/getStudyTasks", async (req, res) => {
    try {
        const studyTasks = await studyTaskDetails.find();
        res.json(studyTasks);
    } catch (err) {
        console.error("Error fetching Study Tasks", err);
        res.status(500).json({
            error: err.message,
            message: "Error fetching the Tasks from the DataBase"
        });
    }
});

// POST API - create a new study task
router.post("/createStudyTask", async (req, res) => {
    try {
        const { Title, Description, Status, Priority } = req.body;
        if (!Title || !Description || Status === undefined || Priority === undefined) {
            return res.status(400).json({
                message: "All fields are required",
            });
        }
        const newTask = new studyTaskDetails({
            Title,
            Description,
            Status,
            Priority
        });

        const savedTask = await newTask.save();
        res.status(201).json({
            message: "Task Created Successfully",
            task: savedTask,
        });
    } catch (error) {
        console.error("Error creating task:", error);
        res.status(500).json({
            message: "Error creating task",
            error: error.message,
        });
    }
});

// PUT API - mark a task as completed
router.put("/completeStudyTask/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const updatedTask = await studyTaskDetails.findByIdAndUpdate(
            id,
            { Status: true },
            { new: true }
        );

        if (!updatedTask) {
            return res.status(404).json({ message: "Task not found" });
        }

        res.json({
            message: "Task marked as completed",
            task: updatedTask
        });
    } catch (error) {
        console.error("Error updating task:", error);
        res.status(500).json({
            message: "Error updating task",
            error: error.message
        });
    }
});

module.exports = router;