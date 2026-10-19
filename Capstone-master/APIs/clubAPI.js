import exp from 'express'
import {ClubModel} from '../backend/clubModel.js'
import {FacultyCoordinatorModel} from '../backend/facultyCoordinatorModel.js'
import {ClubCoordinatorModel} from '../backend/clubCoordinatorModel.js'
import {StudentModel} from '../backend/studentModel.js'
import {EventModel} from '../backend/eventModel.js'
import { verifyToken, authorizeRoles } from '../middleware/authMiddleware.js'

export const clubRouter=exp.Router()

// 1. Verify token for all club routes
clubRouter.use(verifyToken)

// POST /clubs: Only Admin and Faculty can create a club
clubRouter.post("/clubs", authorizeRoles("admin", "facultyCoordinator"), async(req,res)=>{
    try{
        let newClub=req.body
        let facultyID=newClub.facultyCoordinator
        let coordinatorID=newClub.clubCoordinator
        let faculty=await FacultyCoordinatorModel.findById(facultyID)
        let coordinator=await ClubCoordinatorModel.findById(coordinatorID)
        if(!faculty || !coordinator){
            return res.status(404).json({
                success:false,message:"Faculty or club coordinator not found"
            })
        }
        let clubDocument=await ClubModel.create(newClub)
        faculty.clubs.push(clubDocument._id.toString())
        coordinator.clubs.push(clubDocument._id.toString())
        await faculty.save()
        await coordinator.save()
        res.status(201).json({
            success:true,message:"Club created",data:clubDocument
        })
    }
    catch(err){
        res.status(400).json({
            success:false,message:"Failed to create club"
        })
    }
})

// GET /clubs: Any logged-in user can view clubs
clubRouter.get("/clubs",async(req,res)=>{
    try{
        let clubs=await ClubModel.find()
        res.status(200).json({
            success:true,message:"Clubs displayed",data:clubs
        })
    }
    catch(err){
        res.status(400).json({
            success:false,message:"Failed to fetch clubs"
        })
    }
})

// GET /club/:id: Any logged-in user can view a specific club
clubRouter.get("/club/:id",async(req,res)=>{
    try{
        let idOfReq=req.params.id
        let club=await ClubModel.findById(idOfReq)
        if(!club){
            return res.status(404).json({
                success:false,message:"Club not found"
            })
        }
        res.status(200).json({
            success:true,message:"Club found",data:club
        })
    }
    catch(err){
        res.status(400).json({
            success:false,message:"Invalid club ID"
        })
    }
})

// PUT /club/:id: Only Admin, Faculty, or Club Coordinators can update
clubRouter.put("/club/:id", authorizeRoles("admin", "facultyCoordinator", "clubCoordinator"), async(req,res)=>{
    try{
        let idOfReq=req.params.id
        let club=await ClubModel.findById(idOfReq)
        if(!club){
            return res.status(404).json({
                success:false,message:"Club not found"
            })
        }
        let oldFacultyID=club.facultyCoordinator.toString()
        let oldCoordinatorID=club.clubCoordinator.toString()
        let facultyID=req.body.facultyCoordinator
        let coordinatorID=req.body.clubCoordinator
        if(facultyID){
            let faculty=await FacultyCoordinatorModel.findById(facultyID)
            if(!faculty){
                return res.status(404).json({
                    success:false,message:"Faculty coordinator not found"
                })
            }
            club.facultyCoordinator=facultyID
        }
        if(coordinatorID){
            let coordinator=await ClubCoordinatorModel.findById(coordinatorID)
            if(!coordinator){
                return res.status(404).json({
                    success:false,message:"Club coordinator not found"
                })
            }
            club.clubCoordinator=coordinatorID
        }
        if(req.body.clubName!==undefined){
            club.clubName=req.body.clubName
        }
        if(req.body.description!==undefined){
            club.description=req.body.description
        }
        if(req.body.department!==undefined){
            club.department=req.body.department
        }
        if(req.body.category!==undefined){
            club.category=req.body.category
        }
        if(req.body.active!==undefined){
            club.active=req.body.active
        }
        await club.save()
        let newFacultyID=club.facultyCoordinator.toString()
        let newCoordinatorID=club.clubCoordinator.toString()
        if(oldFacultyID!==newFacultyID){
            let oldFaculty=await FacultyCoordinatorModel.findById(oldFacultyID)
            let newFaculty=await FacultyCoordinatorModel.findById(newFacultyID)
            if(oldFaculty){
                let updatedClubs=[]
                for(let clubID of oldFaculty.clubs){
                    if(clubID.toString()!==idOfReq){
                        updatedClubs.push(clubID)
                    }
                }
                oldFaculty.clubs=updatedClubs
                await oldFaculty.save()
            }
            if(newFaculty){
                let alreadyAssigned=false
                for(let clubID of newFaculty.clubs){
                    if(clubID.toString()===idOfReq){
                        alreadyAssigned=true
                    }
                }
                if(!alreadyAssigned){
                    newFaculty.clubs.push(club._id.toString())
                }
                await newFaculty.save()
            }
        }
        if(oldCoordinatorID!==newCoordinatorID){
            let oldCoordinator=await ClubCoordinatorModel.findById(oldCoordinatorID)
            let newCoordinator=await ClubCoordinatorModel.findById(newCoordinatorID)
            if(oldCoordinator){
                let updatedClubs=[]
                for(let clubID of oldCoordinator.clubs){
                    if(clubID.toString()!==idOfReq){
                        updatedClubs.push(clubID)
                    }
                }
                oldCoordinator.clubs=updatedClubs
                await oldCoordinator.save()
            }
            if(newCoordinator){
                let alreadyAssigned=false
                for(let clubID of newCoordinator.clubs){
                    if(clubID.toString()===idOfReq){
                        alreadyAssigned=true
                    }
                }
                if(!alreadyAssigned){
                    newCoordinator.clubs.push(club._id.toString())
                }
                await newCoordinator.save()
            }
        }
        res.status(200).json({
            success:true,message:"Club updated",data:club
        })
    }
    catch(err){
        res.status(400).json({
            success:false,message:"Failed to update club"
        })
    }
})

// DELETE /club/:id: Strictly Admin only due to massive database cascade operations
clubRouter.delete("/club/:id", authorizeRoles("admin"), async(req,res)=>{
    try{
        let idOfReq=req.params.id
        let deletedClub=await ClubModel.findById(idOfReq)
        if(!deletedClub){
            return res.status(404).json({
                success:false,message:"Club not found"
            })
        }
        let facultyID=deletedClub.facultyCoordinator
        let coordinatorID=deletedClub.clubCoordinator
        let faculty=await FacultyCoordinatorModel.findById(facultyID)
        let coordinator=await ClubCoordinatorModel.findById(coordinatorID)
        if(faculty){
            let updatedClubs=[]
            for(let clubID of faculty.clubs){
                if(clubID.toString()!==idOfReq){
                    updatedClubs.push(clubID)
                }
            }
            faculty.clubs=updatedClubs
            await faculty.save()
        }
        if(coordinator){
            let updatedClubs=[]
            for(let clubID of coordinator.clubs){
                if(clubID.toString()!==idOfReq){
                    updatedClubs.push(clubID)
                }
            }
            coordinator.clubs=updatedClubs
            await coordinator.save()
        }
        let students=await StudentModel.find({clubs:idOfReq})
        for(let student of students){
            let updatedClubs=[]
            for(let clubID of student.clubs){
                if(clubID.toString()!==idOfReq){
                    updatedClubs.push(clubID)
                }
            }
            student.clubs=updatedClubs
            await student.save()
        }
        let events=await EventModel.find({club:idOfReq})
        for(let event of events){
            for(let studentID of event.registeredStudents){
                let student=await StudentModel.findById(studentID)
                if(student){
                    let updatedRegisteredEvents=[]
                    for(let registeredEventID of student.registeredEvents){
                        if(registeredEventID.toString()!==event._id.toString()){
                            updatedRegisteredEvents.push(registeredEventID)
                        }
                    }
                    student.registeredEvents=updatedRegisteredEvents
                    let updatedParticipatedEvents=[]
                    for(let participatedEventID of student.participatedEvents){
                        if(participatedEventID.toString()!==event._id.toString()){
                            updatedParticipatedEvents.push(participatedEventID)
                        }
                    }
                    student.participatedEvents=updatedParticipatedEvents
                    let updatedEventsWon=[]
                    for(let wonEventID of student.eventsWon){
                        if(wonEventID.toString()!==event._id.toString()){
                            updatedEventsWon.push(wonEventID)
                        }
                    }
                    student.eventsWon=updatedEventsWon
                    await student.save()
                }
            }
            let eventCoordinators=await ClubCoordinatorModel.find({managedEvents:event._id.toString()})
            for(let eventCoordinator of eventCoordinators){
                let updatedManagedEvents=[]
                for(let managedEventID of eventCoordinator.managedEvents){
                    if(managedEventID.toString()!==event._id.toString()){
                        updatedManagedEvents.push(managedEventID)
                    }
                }
                eventCoordinator.managedEvents=updatedManagedEvents
                await eventCoordinator.save()
            }
            await EventModel.findByIdAndDelete(event._id)
        }
        await ClubModel.findByIdAndDelete(idOfReq)
        res.status(200).json({
            success:true,message:"Club deleted successfully"
        })
    }
    catch(err){
        res.status(400).json({
            success:false,message:"Failed to delete club"
        })
    }
})

// POST /club/:clubid/student/:studentid: Staff can add students, or Students can join themselves
clubRouter.post("/club/:clubid/student/:studentid", authorizeRoles("admin", "facultyCoordinator", "clubCoordinator", "student"), async(req,res)=>{
    try{
        let clubID=req.params.clubid
        let studentID=req.params.studentid
        
        // IDOR Check: If the user is a student, they can only add themselves
        if(req.user.role === "student" && req.user.userId !== studentID) {
            return res.status(403).json({
                success:false,message:"You can only add yourself to a club"
            })
        }

        let club=await ClubModel.findById(clubID)
        let student=await StudentModel.findById(studentID)
        if(!club){
            return res.status(404).json({
                success:false,message:"Club not found"
            })
        }
        if(!student){
            return res.status(404).json({
                success:false,message:"Student not found"
            })
        }
        let alreadyMember=await ClubModel.findOne({
            _id:clubID,
            members:student._id
        })
        if(alreadyMember){
            return res.status(400).json({
                success:false,message:"Student is already a club member"
            })
        }
        club.members.push(student._id)
        student.clubs.push(club._id.toString())
        await club.save()
        await student.save()
        res.status(200).json({
            success:true,message:"Student added to club successfully",data:club
        })
    }
    catch(err){
        res.status(400).json({
            success:false,message:"Failed to add student to club"
        })
    }
})