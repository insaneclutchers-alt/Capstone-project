import exp from 'express'
import {ClassCoordinatorModel} from '../backend/classCoordinatorModel.js'
import {StudentModel} from '../backend/studentModel.js'
import {EventModel} from '../backend/eventModel.js'
import { verifyToken, authorizeRoles } from '../middleware/authMiddleware.js'

export const classCoordinatorRouter=exp.Router()

// Apply authentication and authorization for Class Coordinators and Admins
classCoordinatorRouter.use(verifyToken, authorizeRoles("classCoordinator", "admin"))

classCoordinatorRouter.get("/:id",async(req,res)=>{
    try{
        let idOfReq=req.params.id
        
        // Prevent IDOR: Ensure coordinators can only view their own profile
        if(req.user.role !== "admin" && req.user.userId !== idOfReq){
            return res.status(403).json({ success:false, message:"Unauthorized access to this profile" })
        }

        let coordinator=await ClassCoordinatorModel.findById(idOfReq).select("-password")
        if(!coordinator){
            return res.status(404).json({
                success:false,message:"Class coordinator not found"
            })
        }
        res.status(200).json({
            success:true,message:"Class coordinator profile displayed",data:coordinator
        })
    }
    catch(err){
        res.status(400).json({
            success:false,message:"Invalid coordinator ID"
        })
    }
})

classCoordinatorRouter.put("/:id",async(req,res)=>{
    try{
        let idOfReq=req.params.id

        if(req.user.role !== "admin" && req.user.userId !== idOfReq){
            return res.status(403).json({ success:false, message:"Unauthorized to update this profile" })
        }

        let coordinator=await ClassCoordinatorModel.findById(idOfReq)
        if(!coordinator){
            return res.status(404).json({
                success:false,message:"Class coordinator not found"
            })
        }
        coordinator.firstName=req.body.firstName
        coordinator.lastName=req.body.lastName
        coordinator.department=req.body.department
        coordinator.section=req.body.section
        coordinator.year=req.body.year
        coordinator.email=req.body.email
        coordinator.phoneNumber=req.body.phoneNumber
        await coordinator.save()
        res.status(200).json({
            success:true,message:"Class coordinator profile updated",data:{
                _id:coordinator._id,
                firstName:coordinator.firstName,
                lastName:coordinator.lastName,
                department:coordinator.department,
                section:coordinator.section,
                year:coordinator.year,
                email:coordinator.email,
                phoneNumber:coordinator.phoneNumber
            }
        })
    }
    catch(err){
        res.status(400).json({
            success:false,message:"Failed to update coordinator profile"
        })
    }
})

classCoordinatorRouter.get("/:id/students",async(req,res)=>{
    try{
        if(req.user.role !== "admin" && req.user.userId !== req.params.id){
            return res.status(403).json({ success:false, message:"Unauthorized access" })
        }

        let coordinator=await ClassCoordinatorModel.findById(req.params.id)
        if(!coordinator){
            return res.status(404).json({
                success:false,message:"Class coordinator not found"
            })
        }
        let students=await StudentModel.find({
            department:coordinator.department,
            year:coordinator.year,
            section:coordinator.section
        }).select("-password")
        res.status(200).json({
            success:true,message:"Class students displayed",data:students
        })
    }
    catch(err){
        res.status(400).json({
            success:false,message:"Failed to fetch class students"
        })
    }
})

classCoordinatorRouter.get("/:id/events",async(req,res)=>{
    try{
        if(req.user.role !== "admin" && req.user.userId !== req.params.id){
            return res.status(403).json({ success:false, message:"Unauthorized access" })
        }

        let coordinator=await ClassCoordinatorModel.findById(req.params.id)
        if(!coordinator){
            return res.status(404).json({
                success:false,message:"Class coordinator not found"
            })
        }
        let events=await EventModel.find({
            department:coordinator.department
        })
        res.status(200).json({
            success:true,message:"Department events displayed",data:events
        })
    }
    catch(err){
        res.status(400).json({
            success:false,message:"Failed to fetch events"
        })
    }
})

classCoordinatorRouter.get("/:id/events/:eventid/students",async(req,res)=>{
    try{
        if(req.user.role !== "admin" && req.user.userId !== req.params.id){
            return res.status(403).json({ success:false, message:"Unauthorized access" })
        }

        let coordinator=await ClassCoordinatorModel.findById(req.params.id)
        if(!coordinator){
            return res.status(404).json({
                success:false,message:"Class coordinator not found"
            })
        }
        let event=await EventModel.findById(req.params.eventid)
        if(!event){
            return res.status(404).json({
                success:false,message:"Event not found"
            })
        }
        if(event.department!==coordinator.department){
            return res.status(403).json({
                success:false,message:"You cannot view students for this event"
            })
        }
        let students=await StudentModel.find({
            _id:{$in:event.registeredStudents}
        }).select("-password")
        res.status(200).json({
            success:true,message:"Registered students displayed",data:students
        })
    }
    catch(err){
        res.status(400).json({
            success:false,message:"Failed to fetch registered students"
        })
    }
})

classCoordinatorRouter.get("/:id/students/:studentid",async(req,res)=>{
    try{
        if(req.user.role !== "admin" && req.user.userId !== req.params.id){
            return res.status(403).json({ success:false, message:"Unauthorized access" })
        }

        let coordinator=await ClassCoordinatorModel.findById(req.params.id)
        if(!coordinator){
            return res.status(404).json({
                success:false,message:"Class coordinator not found"
            })
        }
        let student=await StudentModel.findOne({
            _id:req.params.studentid,
            department:coordinator.department,
            year:coordinator.year,
            section:coordinator.section
        }).select("-password")
        if(!student){
            return res.status(404).json({
                success:false,message:"Student not found in this class"
            })
        }
        res.status(200).json({
            success:true,message:"Student details displayed",data:student
        })
    }
    catch(err){
        res.status(400).json({
            success:false,message:"Failed to fetch student"
        })
    }
})

classCoordinatorRouter.put("/:id/students/:studentid/active",async(req,res)=>{
    try{
        if(req.user.role !== "admin" && req.user.userId !== req.params.id){
            return res.status(403).json({ success:false, message:"Unauthorized access" })
        }

        let coordinator=await ClassCoordinatorModel.findById(req.params.id)
        if(!coordinator){
            return res.status(404).json({
                success:false,message:"Class coordinator not found"
            })
        }
        let student=await StudentModel.findOne({
            _id:req.params.studentid,
            department:coordinator.department,
            year:coordinator.year,
            section:coordinator.section
        })
        if(!student){
            return res.status(404).json({
                success:false,message:"Student not found in this class"
            })
        }
        if(typeof req.body.active!=="boolean"){
            return res.status(400).json({
                success:false,message:"Active must be true or false"
            })
        }
        student.active=req.body.active
        await student.save()
        res.status(200).json({
            success:true,
            message:student.active?"Student activated successfully":"Student deactivated successfully",
            data:{
                _id:student._id,
                rollNumber:student.rollNumber,
                active:student.active
            }
        })
    }
    catch(err){
        res.status(400).json({
            success:false,message:"Failed to update student status"
        })
    }
})