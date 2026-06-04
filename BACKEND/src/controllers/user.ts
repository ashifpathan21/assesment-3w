import argon2 from "argon2";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import User from "../models/User.js";
import { signToken } from "../config/jwt.js";
import { UserRequest } from "../types/request.js";
import Post from "../models/Post.js";
import mongoose from "mongoose";


export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req?.body;
        if (!email || !password) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: "Incomplete fields"
            })
        }
        const user = await User.findOne({
            email: email,
        }).select('+password');

        if (!user) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: "Invalid email or password"
            })
        }

        const isPasswordMatch = await argon2.verify(user.password, password);
        if (!isPasswordMatch) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: "Invalid email or password"
            })
        }
        const token = signToken(String(user._id));
        return res.status(StatusCodes.OK).json({
            success: true,
            message: "Logged In",
            token: token
        })
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}


export const signup = async (req: Request, res: Response) => {
    try {
        const { name, username, email, password } = req?.body;
        if (!name || !username || !email || !password) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: "Incomplete fields"
            })
        }
        const existingUser = await User.findOne({
            $or: [
                { email: email },
                { username: username }
            ]
        })
        if (existingUser) {
            return res.status(StatusCodes.CONFLICT).json({
                success: false,
                message: existingUser.username === username ? "Username already exist , try another" : "email already exist , please login"
            })
        }
        const enPass = await argon2.hash(password);
        const user = await User.create({
            name: name,
            email: email,
            password: enPass,
            username: username
        });
        const token = signToken(String(user._id))
        return res.status(StatusCodes.CREATED).json({
            success: true,
            message: 'Signed In',
            token: token
        })

    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

export const profile = async (req: UserRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        const user = await User.findById(userId);
        const posts = await Post.find({
            createdBy: new mongoose.Types.ObjectId(String(userId))
        }).populate("likes comments")
        return res.status(StatusCodes.OK).json({
            success: true,
            message: "Profile Fetched",
            data: {
                user: user,
                posts: posts
            }
        })
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}