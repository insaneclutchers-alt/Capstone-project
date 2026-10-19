import express from "express";
import jwt from "jsonwebtoken";

import { StudentModel } from "../backend/studentModel.js";
import { AdminModel } from "../backend/adminModel.js";
import { HodModel } from "../backend/hodModel.js";
import {
    FacultyCoordinatorModel
} from "../backend/facultyCoordinatorModel.js";
import {
    ClubCoordinatorModel
} from "../backend/clubCoordinatorModel.js";
import {
    ClassCoordinatorModel
} from "../backend/classCoordinatorModel.js";

import { comparePassword } from "../backend/passwordUtils.js";
import { verifyToken } from "../middleware/authMiddleware.js";

export const authRouter = express.Router();

const roleModels = {
    student: StudentModel,
    admin: AdminModel,
    hod: HodModel,
    facultyCoordinator: FacultyCoordinatorModel,
    clubCoordinator: ClubCoordinatorModel,
    classCoordinator: ClassCoordinatorModel
};

// POST /auth-api/login
authRouter.post("/login", async (req, res) => {
    try {
        const { email, password, role } = req.body;

        if (!email || !password || !role) {
            return res.status(400).json({
                success: false,
                message: "Email, password, and role are required"
            });
        }

        if (typeof email !== "string" || typeof password !== "string") {
            return res.status(400).json({
                success: false,
                message: "Invalid login details"
            });
        }

        const Model = roleModels[role];

        if (!Model) {
            return res.status(400).json({
                success: false,
                message: "Invalid account role"
            });
        }

        const user = await Model.findOne({
            email: email.trim().toLowerCase()
        }).select("+password");

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email, password, or role"
            });
        }

        if (user.active === false) {
            return res.status(403).json({
                success: false,
                message: "This account is inactive"
            });
        }

        const passwordMatches = await comparePassword(
            password,
            user.password
        );

        if (!passwordMatches) {
            return res.status(401).json({
                success: false,
                message: "Invalid email, password, or role"
            });
        }

        if (!process.env.JWT_SECRET) {
            return res.status(500).json({
                success: false,
                message: "JWT_SECRET is not configured"
            });
        }

        const token = jwt.sign(
            {
                userId: user._id.toString(),
                role: role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRES_IN || "1d"
            }
        );

        const safeUser = user.toObject();

        delete safeUser.password;
        delete safeUser.__v;

        return res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: {
                ...safeUser,
                role
            }
        });
    } catch (error) {
        console.error("Login error:", error.message);

        return res.status(500).json({
            success: false,
            message: "An error occurred during login"
        });
    }
});

// GET /auth-api/me
// Requires a valid JWT.
//import { verifyToken } from "../middleware/authMiddleware.js";

authRouter.get("/me", verifyToken, async (req, res) => {
    try {
        const Model = roleModels[req.user.role];

        if (!Model) {
            return res.status(401).json({
                success: false,
                message: "Invalid account role"
            });
        }

        const user = await Model.findById(req.user.userId)
            .select("-password -__v");

        if (!user || user.active === false) {
            return res.status(401).json({
                success: false,
                message: "Account not found or inactive"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Authenticated user",
            user: {
                ...user.toObject(),
                role: req.user.role
            }
        });
    } catch (error) {
        console.error("Profile verification error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Unable to verify user"
        });
    }
});