import { Response } from "express";
import { UserRequest } from "../types/request.js";
import { StatusCodes } from "http-status-codes";

export const createPost = async (req: UserRequest, res: Response) => {
    try {
        const userId = req.user.id;
        const { caption } = req?.body;
        const file = req.file ;

    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}