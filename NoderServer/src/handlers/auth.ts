/**
 * Authentication Handler Module
 * 
 * This module contains authentication-related request handlers for the Node.js server.
 * It provides functionality for user authentication using OTP (One-Time Password) verification.
 * 
 * Features:
 * - OTP verification for user login
 * - JWT token generation for authenticated sessions
 * - Database integration using Prisma ORM
 * - Error handling for invalid/expired OTPs
 * 
 * Dependencies:
 * - Prisma client for database operations
 * - JWT module for token creation and management
 * 
 */

import prisma from "../db";
import { createJWT } from "../modules/auth";


export const verifyOtp = async (req, res) => {
    const { email, otpCode } = req.body;

    const user = await prisma.user.findUnique({
        where: { email }
    });


    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    if (user.otpCode !== otpCode) {
        return res.status(401).json({ message: "Invalid OTP" });
    }

    if (user.otpExpires < new Date()) {
        return res.status(401).json({ message: "OTP expired" });
    }

    // OTP is valid, proceed with login
    const token = createJWT(user);
    await prisma.user.update({
        where: { id: user.id },
        data: { otpCode: null, otpExpires: null }
    });
    
    res.json({ accessToken: token, message: 'Registration successful'});
};
