import express from "express";
import mongoose from "mongoose";
import "dotenv/config";

import { authRouter } from "./APIs/authAPI.js";
import { studentRouter } from "./APIs/studentAPI.js";
import { hodRouter } from "./APIs/hodAPI.js";
import { adminRouter } from "./APIs/adminAPI.js";
import { clubCoordinatorRouter } from "./APIs/clubCoordinatorAPI.js";
import { classCoordinatorRouter } from "./APIs/classCoordinatorAPI.js";
import { eventRouter } from "./APIs/eventAPI.js";
import { facultyRouter } from "./APIs/facultyAPI.js";
import { clubRouter } from "./APIs/clubAPI.js";

const app = express();

app.use(express.json());

// Login is available before authentication.
app.use("/auth-api", authRouter);

// Existing API routes.
app.use("/student-api", studentRouter);
app.use("/hod-api", hodRouter);
app.use("/admin-api", adminRouter);
app.use("/club-coordinator-api", clubCoordinatorRouter);
app.use("/class-coordinator-api", classCoordinatorRouter);
app.use("/event-api", eventRouter);
app.use("/faculty-api", facultyRouter);
app.use("/club-api", clubRouter);

const PORT = process.env.PORT || 4000;
const MONGO_URI =
    process.env.MONGO_URI ||
    "mongodb://localhost:27017/college_clubs_platformdb";

async function startServer() {
    try {
        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is missing from .env");
        }

        await mongoose.connect(MONGO_URI);

        console.log("Connected to MongoDB");

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Server startup failed:", error.message);
        process.exit(1);
    }
}

startServer();
