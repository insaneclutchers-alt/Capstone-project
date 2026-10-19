import { Schema, model } from "mongoose";
import { hashPassword } from "./passwordUtils.js";

const hodSchema = new Schema(
    {
        hodID: {
            type: String,
            required: [true, "HOD ID is mandatory"],
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

// Hash the password before saving.
hodSchema.pre("save", async function () {
    if (!this.isModified("password")) {
        return;
    }

    this.password = await hashPassword(this.password);
});

export const HodModel = model("hod", hodSchema);