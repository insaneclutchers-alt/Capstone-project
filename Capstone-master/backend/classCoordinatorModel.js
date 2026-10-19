import {Schema, model} from 'mongoose'
import { hashPassword } from "./passwordUtils.js";

const classCoordinatorSchema = new Schema({
    facultyID: {
        type: String,
        required: [true, "Class Coordinator ID is mandatory"],
        unique: true,
        trim: true
    },
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
    department: {
        type: String,
        required: [true, "Department is mandatory"],
        trim: true
    },
    year: {
        type: Number,
        required: [true, "Academic year is mandatory"],
        enum: {
            values: [1, 2, 3, 4],
            message: "Year must be between 1 and 4"
        }
    },
    section: {
        type: String,
        required: [true, "Section is mandatory"],
        trim: true
    },
    email: {
        type: String,
        required: [true, "Email is mandatory"],
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, "Password is mandatory"],
        minLength: [8, "Password must contain at least 8 characters"]
    },
    phoneNumber: {
        type: String,
        trim: true
    },
    active: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// PASSWORD HASHING MIDDLEWARE (Fixed missing hook)
classCoordinatorSchema.pre("save", async function () {
    if (!this.isModified("password")) {
        return;
    }
    this.password = await hashPassword(this.password);
});

export const ClassCoordinatorModel = model("classCoordinator", classCoordinatorSchema);