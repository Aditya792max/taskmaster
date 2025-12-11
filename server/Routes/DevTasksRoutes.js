const express = require("express");
const devTaskDetails = require("../Models/DevTasksDetails");
const router = express.Router();


// GET API
router.get("/getDevTasks", async (req, res) => {
    try {
        const devTasks = await devTaskDetails.find();
        res.json(devTasks);
    } catch (error) {
        console.error("Error fetching Tasks", error);
        res.status(500).json({
            error: error.message,
            message: "Error fetching the Tasks from the DataBase",
        });
    }
});

// POST API - Create a new task
router.post("/createDevTask", async (req, res) => {
    try {
        const { Title, Description, Status, Priority, deadline } = req.body;

        if (!Title || !Description || Status === undefined || !Priority || !deadline) {
            return res.status(400).json({
                message: "All fields are required",
            });
        }

        const newTask = new devTaskDetails({
            Title,
            Description,
            Status,
            Priority,
            deadline,
        });

        const savedTask = await newTask.save();

        res.status(201).json({
            message: "Task created successfully",
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

// PUT API — mark dev task as completed
router.put("/completeDevTask/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const updatedTask = await devTaskDetails.findByIdAndUpdate(
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