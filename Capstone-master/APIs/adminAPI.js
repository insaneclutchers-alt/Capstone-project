import exp from 'express'
import {HodModel} from '../backend/hodModel.js'
import {StudentModel} from '../backend/studentModel.js'
import {FacultyCoordinatorModel} from '../backend/facultyCoordinatorModel.js'
import {ClassCoordinatorModel} from '../backend/classCoordinatorModel.js'
import {ClubCoordinatorModel} from '../backend/clubCoordinatorModel.js'
import {EventModel} from '../backend/eventModel.js'
import { verifyToken, authorizeRoles } from '../middleware/authMiddleware.js'

export const adminRouter=exp.Router()

// Apply authentication and authorization to all routes in this file
// ONLY users with the "admin" role can access these endpoints
adminRouter.use(verifyToken, authorizeRoles("admin"))

// HOD OPERATIONS
adminRouter.post("/hods",async(req,res)=>{
    try{
        let newHod=req.body
        let hodDocument=await HodModel.create(newHod)
        res.status(201).json({
            success:true,message:"HOD created",data:hodDocument
        })
    }
    catch(err){
        res.status(400).json({
            success:false,message:"Failed to create HOD"
        })
    }
})
adminRouter.get("/hods",async(req,res)=>{
    try{
        let hods=await HodModel.find().select("-password")
        res.status(200).json({
            success:true,message:"HODs displayed",data:hods
        })
    }
    catch(err){
        res.status(500).json({
            success:false,message:"Failed to fetch HODs"
        })
    }
})
adminRouter.get("/hod/:id",async(req,res)=>{
    try{
        let idOfReq=req.params.id
        let hod=await HodModel.findById(idOfReq).select("-password")
        if(!hod){
            return res.status(404).json({
                success:false,message:"HOD not found"
            })
        }
        res.status(200).json({
            success:true,message:"HOD found",data:hod
        })
    }
    catch(err){
        res.status(400).json({
            success:false,message:"Invalid HOD ID"
        })
    }
})
adminRouter.put("/hod/:id",async(req,res)=>{
    try{
        let idOfReq=req.params.id
        let hod=await HodModel.findById(idOfReq)
        if(!hod){
            return res.status(404).json({
                success:false,message:"HOD not found"
            })
        }
        hod.hodID=req.body.hodID
        hod.firstName=req.body.firstName
        hod.lastName=req.body.lastName
        hod.department=req.body.department
        hod.email=req.body.email
        hod.phoneNumber=req.body.phoneNumber
        hod.active=req.body.active
        await hod.save()
        res.status(200).json({
            success:true,message:"HOD updated",data:hod
        })
    }
    catch(err){
        res.status(400).json({
            success:false,message:"Failed to update HOD"
        })
    }
})
adminRouter.delete("/hod/:id",async(req,res)=>{
    try{
        let idOfReq=req.params.id
        let deletedHod=await HodModel.findByIdAndDelete(idOfReq)
        if(!deletedHod){
            return res.status(404).json({
                success:false,message:"HOD not found"
            })
        }
        res.status(200).json({
            success:true,message:"HOD deleted successfully"
        })
    }
    catch(err){
        res.status(400).json({
            success:false,message:"Invalid HOD ID"
        })
    }
})

// STUDENT OPERATIONS
adminRouter.get("/students",async(req,res)=>{
    try{
        let students=await StudentModel.find().select("-password")
        res.status(200).json({
            success:true,message:"Students displayed",data:students
        })
    }
    catch(err){
        res.status(500).json({
            success:false,message:"Failed to fetch students"
        })
    }
})
adminRouter.get("/student/:id",async(req,res)=>{
    try{
        let idOfReq=req.params.id
        let student=await StudentModel.findById(idOfReq).select("-password")
        if(!student){
            return res.status(404).json({
                success:false,message:"Student not found"
            })
        }
        res.status(200).json({
            success:true,message:"Student found",data:student
        })
    }
    catch(err){
        res.status(400).json({
            success:false,message:"Invalid student ID"
        })
    }
})
adminRouter.put("/student/:id",async(req,res)=>{
    try{
        let idOfReq=req.params.id
        let student=await StudentModel.findById(idOfReq)
        if(!student){
            return res.status(404).json({
                success:false,message:"Student not found"
            })
        }
        student.firstName=req.body.firstName
        student.lastName=req.body.lastName
        student.rollNumber=req.body.rollNumber
        student.department=req.body.department
        student.section=req.body.section
        student.year=req.body.year
        student.email=req.body.email
        student.phoneNumber=req.body.phoneNumber
        student.active=req.body.active
        await student.save()
        res.status(200).json({
            success:true,message:"Student updated",data:student
        })
    }
    catch(err){
        res.status(400).json({
            success:false,message:"Failed to update student"
        })
    }
})
adminRouter.delete("/student/:id",async(req,res)=>{
    try{
        let idOfReq=req.params.id
        let deletedStudent=await StudentModel.findByIdAndDelete(idOfReq)
        if(!deletedStudent){
            return res.status(404).json({
                success:false,message:"Student not found"
            })
        }
        res.status(200).json({
            success:true,message:"Student deleted successfully"
        })
    }
    catch(err){
        res.status(400).json({
            success:false,message:"Invalid student ID"
        })
    }
})

// FACULTY COORDINATOR OPERATIONS
adminRouter.post("/faculty",async(req,res)=>{
    try{
        let newFaculty=req.body
        let facultyDocument=await FacultyCoordinatorModel.create(newFaculty)
        res.status(201).json({
            success:true,message:"Faculty created",data:facultyDocument
        })
    }
    catch(err){
        res.status(400).json({
            success:false,message:"Failed to create faculty"
        })
    }
})
adminRouter.get("/faculty",async(req,res)=>{
    try{
        let faculty=await FacultyCoordinatorModel.find().select("-password")
        res.status(200).json({
            success:true,message:"Faculty displayed",data:faculty
        })
    }
    catch(err){
        res.status(400).json({
            success:false,message:"Failed to fetch faculty"
        })
    }
})
adminRouter.get("/faculty/:id",async(req,res)=>{
    try{
        let idOfReq=req.params.id
        let faculty=await FacultyCoordinatorModel.findById(idOfReq).select("-password")
        if(!faculty){
            return res.status(404).json({
                success:false,message:"Faculty not found"
            })
        }
        res.status(200).json({
            success:true,message:"Faculty found",data:faculty
        })
    }
    catch(err){
        res.status(400).json({
            success:false,message:"Invalid faculty ID"
        })
    }
})
adminRouter.put("/faculty/:id",async(req,res)=>{
    try{
        let idOfReq=req.params.id
        let faculty=await FacultyCoordinatorModel.findById(idOfReq)
        if(!faculty){
            return res.status(404).json({
                success:false,message:"Faculty not found"
            })
        }
        faculty.firstName=req.body.firstName
        faculty.lastName=req.body.lastName
        faculty.facultyID=req.body.facultyID
        faculty.department=req.body.department
        faculty.email=req.body.email
        faculty.phoneNumber=req.body.phoneNumber
        faculty.active=req.body.active
        faculty.clubs=req.body.clubs
        faculty.managedEvents=req.body.managedEvents
        await faculty.save()
        res.status(200).json({
            success:true,message:"Faculty updated",data:faculty
        })
    }
    catch(err){
        res.status(400).json({
            success:false,message:"Failed to update faculty"
        })
    }
})
adminRouter.delete("/faculty/:id",async(req,res)=>{
    try{
        let idOfReq=req.params.id
        let deletedFaculty=await FacultyCoordinatorModel.findByIdAndDelete(idOfReq)
        if(!deletedFaculty){
            return res.status(404).json({
                success:false,message:"Faculty not found"
            })
        }
        res.status(200).json({
            success:true,message:"Faculty deleted successfully"
        })
    }
    catch(err){
        res.status(400).json({
            success:false,message:"Invalid faculty ID"
        })
    }
})

// CLASS COORDINATOR OPERATIONS
adminRouter.post("/class-coordinators",async(req,res)=>{
    try{
        let newCoordinator=req.body
        let coordinatorDocument=await ClassCoordinatorModel.create(newCoordinator)
        res.status(201).json({
            success:true,message:"Class coordinator created",data:coordinatorDocument
        })
    }
    catch(err){
        res.status(400).json({
            success:false,message:"Failed to create class coordinator"
        })
    }
})
adminRouter.get("/class-coordinators",async(req,res)=>{
    try{
        let coordinators=await ClassCoordinatorModel.find().select("-password")
        res.status(200).json({
            success:true,message:"Class coordinators displayed",data:coordinators
        })
    }
    catch(err){
        res.status(400).json({
            success:false,message:"Failed to fetch class coordinators"
        })
    }
})
adminRouter.get("/class-coordinator/:id",async(req,res)=>{
    try{
        let idOfReq=req.params.id
        let coordinator=await ClassCoordinatorModel.findById(idOfReq).select("-password")
        if(!coordinator){
            return res.status(404).json({
                success:false,message:"Class coordinator not found"
            })
        }
        res.status(200).json({
            success:true,message:"Class coordinator found",data:coordinator
        })
    }
    catch(err){
        res.status(400).json({
            success:false,message:"Invalid class coordinator ID"
        })
    }
})
adminRouter.put("/class-coordinator/:id",async(req,res)=>{
    try{
        let idOfReq=req.params.id
        let coordinator=await ClassCoordinatorModel.findById(idOfReq)
        if(!coordinator){
            return res.status(404).json({
                success:false,message:"Class coordinator not found"
            })
        }
        coordinator.facultyID=req.body.facultyID
        coordinator.firstName=req.body.firstName
        coordinator.lastName=req.body.lastName
        coordinator.department=req.body.department
        coordinator.year=req.body.year
        coordinator.section=req.body.section
        coordinator.email=req.body.email
        coordinator.phoneNumber=req.body.phoneNumber
        coordinator.active=req.body.active
        await coordinator.save()
        res.status(200).json({
            success:true,message:"Class coordinator updated",data:coordinator
        })
    }
    catch(err){
        res.status(400).json({
            success:false,message:"Failed to update class coordinator"
        })
    }
})
adminRouter.delete("/class-coordinator/:id",async(req,res)=>{
    try{
        let idOfReq=req.params.id
        let deletedCoordinator=await ClassCoordinatorModel.findByIdAndDelete(idOfReq)
        if(!deletedCoordinator){
            return res.status(404).json({
                success:false,message:"Class coordinator not found"
            })
        }
        res.status(200).json({
            success:true,message:"Class coordinator deleted successfully"
        })
    }
    catch(err){
        res.status(400).json({
            success:false,message:"Invalid class coordinator ID"
        })
    }
})

// CLUB COORDINATOR OPERATIONS
adminRouter.post("/club-coordinators",async(req,res)=>{
    try{
        let newCoordinator=req.body
        let coordinatorDocument=await ClubCoordinatorModel.create(newCoordinator)
        res.status(201).json({
            success:true,message:"Club coordinator created",data:coordinatorDocument
        })
    }
    catch(err){
        res.status(400).json({
            success:false,message:"Failed to create club coordinator"
        })
    }
})
adminRouter.get("/club-coordinators",async(req,res)=>{
    try{
        let coordinators=await ClubCoordinatorModel.find().select("-password")
        res.status(200).json({
            success:true,message:"Club coordinators displayed",data:coordinators
        })
    }
    catch(err){
        res.status(500).json({
            success:false,message:"Failed to fetch club coordinators"
        })
    }
})
adminRouter.get("/club-coordinator/:id",async(req,res)=>{
    try{
        let idOfReq=req.params.id
        let coordinator=await ClubCoordinatorModel.findById(idOfReq).select("-password")
        if(!coordinator){
            return res.status(404).json({
                success:false,message:"Club coordinator not found"
            })
        }
        res.status(200).json({
            success:true,message:"Club coordinator found",data:coordinator
        })
    }
    catch(err){
        res.status(400).json({
            success:false,message:"Invalid club coordinator ID"
        })
    }
})
adminRouter.put("/club-coordinator/:id",async(req,res)=>{
    try{
        let idOfReq=req.params.id
        let coordinator=await ClubCoordinatorModel.findById(idOfReq)
        if(!coordinator){
            return res.status(404).json({
                success:false,message:"Club coordinator not found"
            })
        }
        coordinator.firstName=req.body.firstName
        coordinator.lastName=req.body.lastName
        coordinator.rollNumber=req.body.rollNumber
        coordinator.department=req.body.department
        coordinator.section=req.body.section
        coordinator.year=req.body.year
        coordinator.email=req.body.email
        coordinator.phoneNumber=req.body.phoneNumber
        coordinator.active=req.body.active
        coordinator.clubs=req.body.clubs
        coordinator.managedEvents=req.body.managedEvents
        await coordinator.save()
        res.status(200).json({
            success:true,message:"Club coordinator updated",data:coordinator
        })
    }
    catch(err){
        res.status(400).json({
            success:false,message:"Failed to update club coordinator"
        })
    }
})
adminRouter.delete("/club-coordinator/:id",async(req,res)=>{
    try{
        let idOfReq=req.params.id
        let deletedCoordinator=await ClubCoordinatorModel.findByIdAndDelete(idOfReq)
        if(!deletedCoordinator){
            return res.status(404).json({
                success:false,message:"Club coordinator not found"
            })
        }
        res.status(200).json({
            success:true,message:"Club coordinator deleted successfully"
        })
    }
    catch(err){
        res.status(400).json({
            success:false,message:"Invalid club coordinator ID"
        })
    }
})

// EVENT OPERATIONS
adminRouter.post("/events",async(req,res)=>{
    try{
        let newEvent=req.body
        let eventDocument=await EventModel.create(newEvent)
        res.status(201).json({
            success:true,message:"Event created",data:eventDocument
        })
    }
    catch(err){
        res.status(400).json({
            success:false,message:"Failed to create event"
        })
    }
})
adminRouter.get("/events",async(req,res)=>{
    try{
        let events=await EventModel.find()
        res.status(200).json({
            success:true,message:"Events displayed",data:events
        })
    }
    catch(err){
        res.status(500).json({
            success:false,message:"Failed to fetch events"
        })
    }
})
adminRouter.get("/event/:id",async(req,res)=>{
    try{
        let idOfReq=req.params.id
        let event=await EventModel.findById(idOfReq)
        if(!event){
            return res.status(404).json({
                success:false,message:"Event not found"
            })
        }
        res.status(200).json({
            success:true,message:"Event found",data:event
        })
    }
    catch(err){
        res.status(400).json({
            success:false,message:"Invalid event ID" // Fixed typo here
        })
    }
})
adminRouter.put("/event/:id",async(req,res)=>{
    try{
        let idOfReq=req.params.id
        let event=await EventModel.findById(idOfReq)
        if(!event){
            return res.status(404).json({
                success:false,message:"Event not found"
            })
        }
        event.eventName=req.body.eventName
        event.organisers=req.body.organisers
        event.department=req.body.department
        event.facultyCoordinator=req.body.facultyCoordinator
        await event.save()
        res.status(200).json({
            success:true,message:"Event updated",data:event
        })
    }
    catch(err){
        res.status(400).json({
            success:false,message:"Failed to update event"
        })
    }
})
adminRouter.delete("/event/:id",async(req,res)=>{
    try{
        let idOfReq=req.params.id
        let deletedEvent=await EventModel.findByIdAndDelete(idOfReq)
        if(!deletedEvent){
            return res.status(404).json({
                success:false,message:"Event not found"
            })
        }
        res.status(200).json({
            success:true,message:"Event deleted successfully"
        })
    }
    catch(err){
        res.status(400).json({
            success:false,message:"Invalid event ID"
        })
    }
})
adminRouter.get("/students/:department",async(req,res)=>{
    try{
        let departmentName=req.params.department
        let students=await StudentModel.find({department:departmentName}).select("-password")
        res.status(200).json({
            success:true,message:"Department students displayed",data:students
        })
    }
    catch(err){
        res.status(400).json({
            success:false,message:"Failed to fetch students"
        })
    }
})
adminRouter.get("/department/events/:department",async(req,res)=>{
    try{
        let departmentName=req.params.department
        let events=await EventModel.find({department:departmentName})
        res.status(200).json({
            success:true,message:"Department events displayed",data:events
        })
    }
    catch(err){
        res.status(500).json({
            success:false,message:"Failed to fetch events"
        })
    }
})
adminRouter.put("/student/:id/activate",async(req,res)=>{
    try{
        let idOfReq=req.params.id
        let student=await StudentModel.findById(idOfReq)
        if(!student){
            return res.status(404).json({
                success:false,message:"Student not found"
            })
        }
        student.active=true
        await student.save()
        res.status(200).json({
            success:true,message:"Student activated successfully"
        })
    }
    catch(err){
        res.status(400).json({
            success:false,message:"Invalid student ID"
        })
    }
})
adminRouter.put("/student/:id/deactivate",async(req,res)=>{
    try{
        let idOfReq=req.params.id
        let student=await StudentModel.findById(idOfReq)
        if(!student){
            return res.status(404).json({
                success:false,message:"Student not found"
            })
        }
        student.active=false
        await student.save()
        res.status(200).json({
            success:true,message:"Student deactivated successfully"
        })
    }
    catch(err){
        res.status(400).json({
            success:false,message:"Invalid student ID"
        })
    }
})
adminRouter.get("/event/:eventid/students",async(req,res)=>{
    try{
        let eventID=req.params.eventid
        let event=await EventModel.findById(eventID)
        if(!event){
            return res.status(404).json({
                success:false,message:"Event not found"
            })
        }
        let students=await StudentModel.find({_id:{$in:event.registeredStudents}}).select("-password")
        res.status(200).json({
            success:true,message:"Registered students displayed successfully",data:students
        })
    }
    catch(err){
        res.status(400).json({
            success:false,message:"Invalid event ID"
        })
    }
})