import { Response } from "express";
import { UserRequest } from "../types/request.js";
import { StatusCodes } from "http-status-codes";
import Post from "../models/Post.js";
import mongoose from "mongoose";
import { deleteFromCloudinary, uploadToCloudinary } from "../config/cloudinary.js";
import Like from "../models/Like.js";
import Comment from "../models/Comment.js";

export const createPost = async (req: UserRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        const { caption } = req?.body;
        const file = req.file;
        if (!file && !caption) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: "Incomplete fields"
            })
        }
        let post = null;
        if (caption) {
            post = await Post.create({
                caption: caption,
                createdBy: new mongoose.Types.ObjectId(String(userId))
            })
        } else if (file) {
            const res = await uploadToCloudinary(file);
            post = await Post.create({
                contentUrl: res.secure_url,
                publicId: res.public_id
            })
        }
        return res.status(StatusCodes.CREATED).json({
            success: true,
            message: "Post uploaded",
            data: post
        })
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}


export const deletePost = async (req: UserRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        const postId = req.params.postId;
        if (!postId) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: "Please provide post id"
            })
        }
        const post = await Post.findOne({
            _id: postId,
            createdBy: new mongoose.Types.ObjectId(String(userId))
        });

        if (!post) {
            return res.status(StatusCodes.NOT_FOUND).json({
                success: false,
                message: "Post not found"
            })
        }
        if (post.publicId) {
            await deleteFromCloudinary(post.publicId)
        }
        await Like.deleteMany({
            post: postId
        })
        await Comment.deleteMany({
            post: postId
        })
        await post.deleteOne();
        return res.status(StatusCodes.NO_CONTENT).json({
            success: true,
            message: "Post deleted"
        })
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

export const getPosts = async (req: UserRequest, res: Response) => {
    try {
        const q: number = Number(req.query?.q) || 0;
        const posts = await Post.find().populate("likes comments").sort({ createdAt: -1 }).skip(q * 30);
        return res.status(StatusCodes.OK).json({
            success: true,
            message: "Posts Fetched",
            data: posts
        })
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}