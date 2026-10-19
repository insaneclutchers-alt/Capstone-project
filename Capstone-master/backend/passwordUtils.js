import bcrypt from "bcryptjs";

export async function hashPassword(password) {
    if (typeof password !== "string" || password.length < 8) {
        throw new Error("Password must contain at least 8 characters");
    }

    return await bcrypt.hash(password, 12);
}

export async function comparePassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
}