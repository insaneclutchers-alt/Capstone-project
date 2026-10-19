import { Schema, model } from "mongoose";
import { hashPassword } from "./passwordUtils.js";

const facultyCoordinatorSchema = new Schema(
    {
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

        facultyID: {
            type: String,
            required: [true, "Faculty ID is mandatory"],
            unique: true,
            trim: true
        },

        department: {
            type: String,
            required: [true, "Department is mandatory"],
            trim: true
        },

        email: {
            type: String,
            required: [true, "Email is mandatory"],
            unique: true,
            trim: true
        },

        password: {
            type: String,
            required: [true, "Password is mandatory"],
            minLength: [
                8,
                "Password must contain at least 8 characters"
            ],
            trim: false
        },

        phoneNumber: {
            type: String,
            required: [true, "Phone number is mandatory"],
            unique: [true, "Phone number already exists"],
            trim: true
        },

        active: {
            type: Boolean,
            default: true
        },

        clubs: {
            type: [String],
            default: []
        },

        managedEvents: {
            type: [String],
            default: []
        }
    },
    {
        timestamps: true
    }
);

// Hash the password before saving.
facultyCoordinatorSchema.pre("save", async function () {
    if (!this.isModified("password")) {
        return;
    }

    this.password = await hashPassword(this.password);
});

export const FacultyCoordinatorModel = model(
    "facultyCoordinator",
    facultyCoordinatorSchema
);