import exp from 'express'
import { FacultyCoordinatorModel } from '../backend/facultyCoordinatorModel.js'
import { EventModel } from '../backend/eventModel.js'
import { StudentModel } from '../backend/studentModel.js'
import { verifyToken, authorizeRoles } from '../middleware/authMiddleware.js'

export const facultyRouter = exp.Router()

// Apply authentication and restrict access to Faculty Coordinators and Admins
facultyRouter.use(verifyToken, authorizeRoles("facultyCoordinator", "admin"))

facultyRouter.post("/faculty", async (req, res) => {
    try {
        let newFaculty = req.body
        let facultyDocument = await FacultyCoordinatorModel.create(newFaculty)
        res.status(201).json({
            success: true, message: "Faculty created", data: facultyDocument
        })
    }
    catch (err) {
        res.status(400).json({
            success: false, message: "Failed to create faculty"
        })
    }
})

facultyRouter.get("/events", async (req, res) => {
    try {
        let events = await EventModel.find()
        res.status(200).json({
            success: true, message: "Events displayed", data: events
        })
    }
    catch (err) {
        res.status(500).json({
            success: false, message: "Failed to fetch events"
        })
    }
})

facultyRouter.get("/event/:id", async (req, res) => {
    try {
        let idOfReq = req.params.id
        let event = await EventModel.findById(idOfReq)
        if (!event) {
            return res.status(404).json({
                success: false, message: "Event not found"
            })
        }
        res.status(200).json({
            success: true, message: "Event found", data: event
        })
    }
    catch (err) {
        res.status(400).json({
            success: false, message: "Invalid event ID"
        })
    }
})

facultyRouter.post("/events", async (req, res) => {
    try {
        let newEvent = req.body

        // Optional Security Check: Ensure the logged-in faculty is only creating events for themselves
        if (req.user.role !== "admin" && req.user.userId !== newEvent.facultyCoordinator) {
            return res.status(403).json({
                success: false, message: "You can only create events for your own faculty account"
            })
        }

        let faculty = await FacultyCoordinatorModel.findById(newEvent.facultyCoordinator)

        if (!faculty) {
            return res.status(404).json({
                success: false, message: "Faculty coordinator not found"
            })
        }

        let eventDocument = await EventModel.create(newEvent)

        res.status(201).json({
            success: true, message: "Event created", data: eventDocument
        })
    }
    catch (err) {
        res.status(400).json({
            success: false, message: "Failed to create event"
        })
    }
})

facultyRouter.put("/events/:id", async (req, res) => {
    try {
        let idOfReq = req.params.id
        let updatedEvent = await EventModel.findById(idOfReq)
        
        if (!updatedEvent) {
            return res.status(404).json({
                success: false, message: "Event not found"
            })
        }

        // Prevent updating events that don't belong to the logged-in faculty
        if (req.user.role !== "admin" && updatedEvent.facultyCoordinator.toString() !== req.user.userId) {
            return res.status(403).json({
                success: false, message: "Unauthorized to update this event"
            })
        }

        updatedEvent.eventName = req.body.eventName
        updatedEvent.organisers = req.body.organisers
        updatedEvent.department = req.body.department
        await updatedEvent.save()
        
        res.status(200).json({
            success: true, message: "Event updated", data: updatedEvent
        })
    }
    catch (err) {
        res.status(400).json({
            success: false, message: "Failed to update event"
        })
    }
})

facultyRouter.delete("/events/:id", async (req, res) => {
    try {
        let idOfReq = req.params.id
        let targetEvent = await EventModel.findById(idOfReq)

        if (!targetEvent) {
            return res.status(404).json({
                success: false, message: "Event not found"
            })
        }

        // Prevent deleting events that don't belong to the logged-in faculty
        if (req.user.role !== "admin" && targetEvent.facultyCoordinator.toString() !== req.user.userId) {
            return res.status(403).json({
                success: false, message: "Unauthorized to delete this event"
            })
        }

        await EventModel.findByIdAndDelete(idOfReq)

        res.status(200).json({
            success: true, message: "Event deleted successfully"
        })
    }
    catch (err) {
        res.status(400).json({
            success: false, message: "Invalid event ID"
        })
    }
})

facultyRouter.get("/events/:eventid/students", async (req, res) => {
    try {
        let eventID = req.params.eventid
        let event = await EventModel.findById(eventID)
        
        if (!event) {
            return res.status(404).json({
                success: false, message: "Event not found"
            })
        }
        
        let students = await StudentModel.find({
            _id: { $in: event.registeredStudents }
        }).select("-password")
        
        res.status(200).json({
            success: true, message: "Registered students displayed", data: students
        })
    }
    catch (err) {
        res.status(400).json({
            success: false, message: "Failed to fetch students"
        })
    }
})

facultyRouter.get("/faculty/:facultyid/events", async (req, res) => {
    try {
        let facultyID = req.params.facultyid

        // Prevent IDOR: Ensure faculty can only view their own designated events
        if (req.user.role !== "admin" && req.user.userId !== facultyID) {
            return res.status(403).json({
                success: false, message: "Unauthorized to view events for this faculty"
            })
        }

        let events = await EventModel.find({ facultyCoordinator: facultyID })
        res.status(200).json({
            success: true, message: "Faculty events displayed", data: events
        })
    }
    catch (err) {
        res.status(400).json({
            success: false, message: "Failed to fetch faculty events"
        })
    }
})