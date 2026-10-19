import {Schema,model} from 'mongoose'
const clubSchema =new Schema({
    clubName:{
        type:String,
        required:[true,"Club name is mandatory"],
        unique:true,
        trim:true
    },
    description:{
        type:String,
        required:[true,"Club description is mandatory"],
        trim:true
    },
    events:{
        type:[Schema.Types.ObjectId],
        ref:"event",
        default:[]
    },
    department:{
        type:String,
        required:[true, "Department is mandatory"],
        trim:true
    },
    category:{
        type:String,
        required:[true, "Club category is mandatory"],
        enum:{
            values:["Technical","Cultural","Sports","Literary","Arts","Other"],
            message:"Invalid club category"
        }
    },
    facultyCoordinator:{
        type:Schema.Types.ObjectId,
        ref:"facultyCoordinator",
        required:[true, "Faculty coordinator is mandatory"]
    },
    clubCoordinator:{
        type:Schema.Types.ObjectId,
        ref:"clubCoordinator",
        required:[true, "Club coordinator is mandatory"]
    },
    members:{
        type:[Schema.Types.ObjectId],
        ref:"student",
        default:[]
    },
    active:{
        type:Boolean,
        default:true
    }
}, {
    timestamps:true
})
export const ClubModel=model("club",clubSchema)