import exp from 'express';
import { StudentModel } from '../backend/studentModel.js';
import { EventModel } from '../backend/eventModel.js';
import { verifyToken, authorizeRoles } from '../middleware/authMiddleware.js';

export const hodRouter = exp.Router();

// Apply authentication and authorization to all routes in this router
// Only users with the "hod" or "admin" role can access these endpoints
hodRouter.use(verifyToken, authorizeRoles("hod", "admin"));

hodRouter.get("/events", async (req, res) => {
    try {
        let events = await EventModel.find();
        res.status(200).json({ success: true, message: "Events displayed", data: events });
    } catch (err) {
        res.status(404).json({ success: false, message: "Failed to fetch events" });
    }
});

hodRouter.get("/students/:department", async (req, res) => {
    try {
        let departmentName = req.params.department;
        let students = await StudentModel.find({ department: departmentName }).select("-password");
        res.status(200).json({ success: true, message: "Department students displayed", data: students });
    } catch (err) {
        res.status(404).json({ success: false, message: "Failed to fetch students" });
    }
});

hodRouter.get("/student/:id/:department", async (req, res) => {
    try {
        let idOfReq = req.params.id;
        let departmentName = req.params.department;
        let student = await StudentModel.findById(idOfReq).select("-password");
        if (!student) {
            return res.status(404).json({ success: false, message: "Student not found" });
        }
        if (student.department !== departmentName) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        res.status(200).json({ success: true, message: "Student found", data: student });
    } catch (err) {
        res.status(404).json({ success: false, message: "Invalid ID" });
    }
});

hodRouter.get("/department/events/:department", async (req, res) => {
    try {
        let departmentName = req.params.department;
        let events = await EventModel.find({ department: departmentName });
        res.status(200).json({ success: true, message: "Department events displayed", data: events });
    } catch (err) {
        res.status(404).json({ success: false, message: "Failed to fetch department events" });
    }
});

hodRouter.get("/department/events/:eventid/students/:department", async (req, res) => {
    try {
        let eventID = req.params.eventid;
        let departmentName = req.params.department;
        let event = await EventModel.findById(eventID);
        if (!event) {
            return res.status(404).json({ success: false, message: "Event not found" });
        }
        let students = await StudentModel.find({ _id: { $in: event.registeredStudents }, department: departmentName }).select("-password");
        res.status(200).json({ success: true, message: "Registered students displayed", data: students });
    } catch (err) {
        res.status(404).json({ success: false, message: "Failed to fetch registered students" });
    }
});

hodRouter.get("/department/student/:id/events/:department", async (req, res) => {
    try {
        let idOfReq = req.params.id;
        let departmentName = req.params.department;
        let student = await StudentModel.findById(idOfReq);
        if (!student) {
            return res.status(404).json({ success: false, message: "Student not found" });
        }
        if (student.department !== departmentName) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        let events = await EventModel.find({ _id: { $in: student.registeredEvents } });
        res.status(200).json({ success: true, message: "Registered events displayed", data: events });
    } catch (err) {
        res.status(404).json({ success: false, message: "Failed to fetch registered events" });
    }
});

hodRouter.get("/department/student/:id/participation/:department", async (req, res) => {
    try {
        let idOfReq = req.params.id;
        let departmentName = req.params.department;
        let student = await StudentModel.findById(idOfReq);
        if (!student) {
            return res.status(404).json({ success: false, message: "Student not found" });
        }
        if (student.department !== departmentName) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        let events = await EventModel.find({ _id: { $in: student.participatedEvents } });
        res.status(200).json({ success: true, message: "Participation history displayed", data: events });
    } catch (err) {
        res.status(404).json({ success: false, message: "Failed to fetch participation history" });
    }
});
