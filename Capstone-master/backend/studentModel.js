import { Schema, model } from "mongoose";
import { hashPassword } from "./passwordUtils.js";

const studentSchema = new Schema({

    firstName: {
        type: String,
        required: [true, "First name is mandatory"],
        minLength: [2, "First name must contain at least 2 characters"],
        trim: true
    },

    lastName: {
        type: String,
        trim: true
    },

    rollNumber: {
        type: String,
        required: [true, "Student Rollnumber is mandatory"],
        unique: true,
        trim: true
    },

    department: {
        type: String,
        required: [true, "Department is mandatory"],
        trim: true
    },

    section: {
        type: String,
        required: [true, "Section is required"],
        enum: {
            values: ["A", "B", "C", "D", "E"],
            message: "Enter valid section"
        }
    },

    year: {
        type: Number,
        required: [true, "Academic Year is mandatory"],
        enum: {
            values: [1, 2, 3, 4],
            message: "Year must be between 1 and 4"
        }
    },

    email: {
        type: String,
        required: [true, "Email is mandatory"],
        unique: [true, "Email already existed"],
        lowercase: true,
        trim: true
    },

    password: {
        type: String,
        required: [true, "Password is mandatory"],
        minLength: [8, "Password must contain at least 8 characters"],
        trim: false
    },

    phoneNumber: {
        type: String,
        required: [true, "Phone number is mandatory"],
        unique: [true, "Phone number already exists"]
    },

    active: {
        type: Boolean,
        default: true
    },

    clubs: {
        type: [String],
        default: []
    },

    registeredEvents: {
        type: [Schema.Types.ObjectId],
        ref: "event",
        default: []
    },

    participatedEvents: {
        type: [Schema.Types.ObjectId],
        ref: "event",
        default: []
    },

    eventsWon: {
        type: [Schema.Types.ObjectId],
        ref: "event",
        default: []
    }

}, {
    timestamps: true
});


// PASSWORD HASHING MIDDLEWARE
studentSchema.pre("save", async function () {

    // Hash only when the password is new or modified
    if (!this.isModified("password")) {
        return;
    }

    this.password = await hashPassword(this.password);
});


// CREATE AND EXPORT MODEL
export const StudentModel = model("student", studentSchema);