import { Schema, model } from "mongoose";
import { hashPassword } from "./passwordUtils.js";

const adminSchema = new Schema(
    {
        adminID: {
            type: String,
            required: [true, "Admin ID is mandatory"],
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
    },
    {
        timestamps: true
    }
);

// Hash the password before saving a new admin or updating their password.
adminSchema.pre("save", async function () {
    if (!this.isModified("password")) {
        return;
    }

    this.password = await hashPassword(this.password);
});

export const AdminModel = model("admin", adminSchema);