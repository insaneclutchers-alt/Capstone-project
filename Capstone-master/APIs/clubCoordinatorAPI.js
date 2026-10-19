import exp from 'express'
import {ClubCoordinatorModel} from '../backend/clubCoordinatorModel.js'
import {EventModel} from '../backend/eventModel.js'
import {StudentModel} from '../backend/studentModel.js'
export const clubCoordinatorRouter=exp.Router()
clubCoordinatorRouter.get("/clubs/:id",async(req,res)=>{
    try{
        let idOfReq=req.params.id
        let coordinator=await ClubCoordinatorModel.findById(idOfReq).select("-password")
        if(!coordinator){
            return res.status(404).json({
                success:false,message:"Club coordinator not found"
            })
        }
        res.status(200).json({
            success:true,message:"Assigned clubs displayed",data:coordinator.clubs
        })
    }
    catch(err){
        res.status(400).json({
            success:false,message:"Invalid coordinator ID"
        })
    }
})
clubCoordinatorRouter.get("/coordinator/:id/events",async(req,res)=>{
    try{
        let idOfReq=req.params.id
        let coordinator=await ClubCoordinatorModel.findById(idOfReq)
        if(!coordinator){
            return res.status(404).json({
                success:false,message:"Club coordinator not found"
            })
        }
        let events=await EventModel.find({_id:{$in:coordinator.managedEvents}})
        res.status(200).json({
            success:true,message:"Managed events displayed",data:events
        })
    }
    catch(err){
        res.status(400).json({
            success:false,message:"Failed to fetch managed events"
        })
    }
})
clubCoordinatorRouter.post("/coordinator/:id/events",async(req,res)=>{
    try{
        let idOfReq=req.params.id
        let coordinator=await ClubCoordinatorModel.findById(idOfReq)
        if(!coordinator){
            return res.status(404).json({
                success:false,message:"Club coordinator not found"
            })
        }
        let newEvent=req.body
        let eventDocument=await EventModel.create(newEvent)
        coordinator.managedEvents.push(eventDocument._id.toString())
        await coordinator.save()
        res.status(201).json({
            success:true,message:"Event created successfully",data:eventDocument
        })
    }
    catch(err){
        res.status(400).json({
            success:false,message:"Failed to create event"
        })
    }
})
clubCoordinatorRouter.get("/events",async(req,res)=>{
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
clubCoordinatorRouter.get("/event/:id",async(req,res)=>{
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
            success:false,message:"Invalid event ID"
        })
    }
})
clubCoordinatorRouter.put("/coordinator/:coordinatorid/event/:eventid",async(req,res)=>{
    try{
        let coordinatorID=req.params.coordinatorid
        let eventID=req.params.eventid
        let coordinator=await ClubCoordinatorModel.findById(coordinatorID)
        if(!coordinator){
            return res.status(404).json({
                success:false,message:"Club coordinator not found"
            })
        }
        if(!coordinator.managedEvents.includes(eventID)){
            return res.status(401).json({
                success:false,message:"You cannot update this event"
            })
        }
        let event=await EventModel.findById(eventID)
        if(!event){
            return res.status(404).json({
                success:false,message:"Event not found"
            })
        }
        event.eventName=req.body.eventName
        event.organisers=req.body.organisers
        event.department=req.body.department
        await event.save()
        res.status(200).json({
            success:true,message:"Event updated successfully",data:event
        })
    }
    catch(err){
        res.status(400).json({
            success:false,message:"Failed to update event"
        })
    }
})
clubCoordinatorRouter.delete("/coordinator/:coordinatorid/event/:eventid",async(req,res)=>{
    try{
        let coordinatorID=req.params.coordinatorid
        let eventID=req.params.eventid
        let coordinator=await ClubCoordinatorModel.findById(coordinatorID)
        if(!coordinator){
            return res.status(404).json({
                success:false,message:"Club coordinator not found"
            })
        }
        if(!coordinator.managedEvents.includes(eventID)){
            return res.status(401).json({
                success:false,message:"You cannot delete this event"
            })
        }
        let deletedEvent=await EventModel.findByIdAndDelete(eventID)
        if(!deletedEvent){
            return res.status(404).json({
                success:false,message:"Event not found"
            })
        }
        coordinator.managedEvents=coordinator.managedEvents.filter((id)=>id!==eventID)
        await coordinator.save()
        res.status(200).json({
            success:true,message:"Event deleted successfully"
        })
    }
    catch(err){
        res.status(400).json({
            success:false,message:"Failed to delete event"
        })
    }
})
clubCoordinatorRouter.get("/coordinator/:coordinatorid/event/:eventid/students",async(req,res)=>{
    try{
        let coordinatorID=req.params.coordinatorid
        let eventID=req.params.eventid
        let coordinator=await ClubCoordinatorModel.findById(coordinatorID)
        if(!coordinator){
            return res.status(404).json({
                success:false,message:"Club coordinator not found"
            })
        }
        if(!coordinator.managedEvents.includes(eventID)){
            return res.status(401).json({
                success:false,message:"You cannot view students for this event"
            })
        }
        let event=await EventModel.findById(eventID)
        if(!event){
            return res.status(404).json({
                success:false,message:"Event not found"
            })
        }
        let students=await StudentModel.find({_id:{$in:event.registeredStudents}}).select("-password")
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
clubCoordinatorRouter.get("/profile/:id",async(req,res)=>{
    try{
        let idOfReq=req.params.id
        let coordinator=await ClubCoordinatorModel.findById(idOfReq).select("-password")
        if(!coordinator){
            return res.status(404).json({
                success:false,message:"Club coordinator not found"
            })
        }
        res.status(200).json({
            success:true,message:"Coordinator profile displayed",data:coordinator
        })
    }
    catch(err){
        res.status(400).json({
            success:false,message:"Invalid coordinator ID"
        })
    }
})
clubCoordinatorRouter.put("/profile/:id",async(req,res)=>{
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
        coordinator.department=req.body.department
        coordinator.section=req.body.section
        coordinator.year=req.body.year
        coordinator.email=req.body.email
        coordinator.phoneNumber=req.body.phoneNumber
        await coordinator.save()
        res.status(200).json({
            success:true,message:"Coordinator profile updated",data:{
                _id:coordinator._id,
                firstName:coordinator.firstName,
                lastName:coordinator.lastName,
                rollNumber:coordinator.rollNumber,
                department:coordinator.department,
                section:coordinator.section,
                year:coordinator.year,
                email:coordinator.email,
                phoneNumber:coordinator.phoneNumber,
                active:coordinator.active,
                clubs:coordinator.clubs,
                managedEvents:coordinator.managedEvents
            }
        })
    }
    catch(err){
        res.status(400).json({
            success:false,message:"Failed to update coordinator profile"
        })
    }
})
