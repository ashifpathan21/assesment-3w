import { NextFunction, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { UserRequest } from "../types/request.js";
import { decodeToken } from "../config/jwt.js";
import User from "../models/User.js";

export const authMiddleware = async (req: UserRequest, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                success: false,
                message: 'Unauthorized'
            })
        }
        const userId = decodeToken(token);
        const user = await User.findById(userId);
        if (!user) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                success: false,
                message: 'Unauthorized'
            })
        }
        req.user = { id: userId };
        next()
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}