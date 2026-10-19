import exp from 'express';
import { StudentModel } from '../backend/studentModel.js';
import { EventModel } from '../backend/eventModel.js';
import { verifyToken, authorizeRoles } from '../middleware/authMiddleware.js';
import { performSemanticSearch } from '../services/performSemanticSearch.service.js';

export const studentRouter = exp.Router();

// 1. STUDENT REGISTRATION / CREATION
// Usually open for registration or restricted to admin. Let's allow public sign-up or admin creation.
studentRouter.post("/students", async (req, res) => {
    try {
        let newstudent = req.body;
        let studentDocument = await StudentModel.create(newstudent);
        res.status(201).json({
            success: true,
            message: "Student created",
            data: studentDocument
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            message: "Failed to create student",
            error: err.message
        });
    }
});

// 2. GET ALL EVENTS (Authenticated users can view events)
studentRouter.get("/events", verifyToken, async (req, res) => {
    try {
        let events = await EventModel.find();
        res.status(200).json({
            success: true,
            message: "Events displayed",
            data: events
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch events"
        });
    }
});

// 3. GET STUDENT BY ID (Protected: Only the student themselves or an Admin)
studentRouter.get("/student/:id", verifyToken, async (req, res) => {
    try {
        let idOfReq = req.params.id;

        // Prevent IDOR: Ensure student views only their own profile unless they are admin
        if (req.user.role !== "admin" && req.user.userId !== idOfReq) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized to access this student profile"
            });
        }

        let student = await StudentModel.findById(idOfReq).select("-password");
        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }
        res.status(200).json({
            success: true,
            message: "Student found",
            data: student
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            message: "Invalid ID"
        });
    }
});

// 4. DELETE STUDENT (Protected: Strictly Admin only)
studentRouter.delete("/student/:id", verifyToken, authorizeRoles("admin"), async (req, res) => {
    try {
        let idOfReq = req.params.id;
        let deletedStudent = await StudentModel.findByIdAndDelete(idOfReq);
        if (!deletedStudent) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }
        res.status(200).json({
            success: true,
            message: "Student deleted successfully"
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            message: "Invalid student Id"
        });
    }
});

// 5. REGISTER FOR EVENT (Protected: Student can register themselves)
studentRouter.post("/events/:eventid/register/:studentid", verifyToken, async (req, res) => {
    try {
        let eventID = req.params.eventid;
        let studentID = req.params.studentid;

        // Prevent unauthorized registration on behalf of other students
        if (req.user.role !== "admin" && req.user.userId !== studentID) {
            return res.status(403).json({
                success: false,
                message: "You can only register yourself for events"
            });
        }

        let event = await EventModel.findById(eventID);
        let student = await StudentModel.findById(studentID);

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }
        if (!event) {
            return res.status(404).json({
                success: false,
                message: "Event not found"
            });
        }

        // Check if already registered
        if (event.registeredStudents.includes(studentID)) {
            return res.status(400).json({
                success: false,
                message: "Student is already registered"
            });
        }

        event.registeredStudents.push(studentID);
        await event.save();

        res.status(200).json({
            success: true,
            message: "Student registered successfully"
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            message: "Registration failed"
        });
    }
});

// 6. UNREGISTER FROM EVENT (Protected: Student can unregister themselves)
studentRouter.delete("/events/:eventid/register/:studentid", verifyToken, async (req, res) => {
    try {
        let eventID = req.params.eventid;
        let studentID = req.params.studentid;

        if (req.user.role !== "admin" && req.user.userId !== studentID) {
            return res.status(403).json({
                success: false,
                message: "You can only unregister yourself from events"
            });
        }

        let event = await EventModel.findById(eventID);
        if (!event) {
            return res.status(404).json({
                success: false,
                message: "Event not found"
            });
        }

        event.registeredStudents = event.registeredStudents.filter((arg) => arg.toString() !== studentID);
        await event.save();

        res.status(200).json({
            success: true,
            message: "Student unregistered successfully"
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            message: "Unregistration failed"
        });
    }
});

//Semantic Search 
studentRouter.post("/search",async (req,res)=>{
    let { query } = req.body;
    if(!query || query.trim() === ""){
        return res.status(400).json({success: false, message: 'Query is required'});
    }

    const { answer, semanticSearchResults } = await performSemanticSearch(query)
    res.status(200).json({success: true, message: 'Semantic search results found', data: { answer, semanticSearchResults }});
})