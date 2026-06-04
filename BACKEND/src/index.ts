import { createServer } from "http";
import app from "./server.js";
import 'dotenv/config'
import { Server, Socket } from "socket.io";
import { decodeToken } from "./config/jwt.js";
import User from "./models/User.js";
import Like from "./models/Like.js";
import Post from "./models/Post.js";
import mongoose, { isValidObjectId } from "mongoose";
import Comment from "./models/Comment.js";


const server = createServer(app);
const PORT = process.env.PORT || 3000;


interface UserSocket extends Socket {
    userId?: String;
}

export const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URI || 'http://localhost:5173'
    }
});


io.use(
    async (
        socket: UserSocket,
        next
    ) => {
        try {
            const token =
                socket.handshake.auth?.token ||
                socket.handshake.headers
                    ?.authorization;
            const t = token?.split(" ")[1];
            if (!t) {
                return next(new Error("Unauthorized"));
            }

            const userId = decodeToken(t);

            if (userId) {
                return next(new Error("Unauthorized"));
            }

            const dbUser = await User.findById(userId);

            if (!dbUser) {
                return next(new Error("Unauthorized"));
            }

            socket.userId = userId;
            next();
        } catch (err) {
            next(new Error("Unauthorized"));
        }
    }
);

interface ILike {
    id: String
}

interface IComment {
    id: String;
    text: String;
    commentId?: String
}

io.on('connection',
    async (socket: UserSocket) => {
        try {
            if (!socket.userId) {
                socket.disconnect();
                return;
            }

            socket.join(`user:${socket.userId}`);

            socket.on('like-post', async (data: ILike) => {
                try {

                    if (!isValidObjectId(data.id)) {
                        throw new Error('Post id is not valid');
                    }
                    const post = await Post.findById(data.id);
                    if (!post) {
                        throw new Error('Post not found');
                    }
                    const isAlreadyLiked = await Like.findOne({
                        by: new mongoose.Types.ObjectId(String(socket.userId)),
                        post: new mongoose.Types.ObjectId(String(data.id))
                    })
                    if (isAlreadyLiked) {
                        throw new Error('Already Liked');
                    }
                    const like = await Like.create({
                        by: new mongoose.Types.ObjectId(String(socket.userId)),
                        post: new mongoose.Types.ObjectId(String(data.id))
                    })

                    await like.populate('by')
                    const updatedPost = await Post.findById(data.id).populate("likes comments")
                    socket.to(`user:${post.createdBy}`).emit("liked-your-post", JSON.stringify({ data: like }))
                    socket.send(JSON.stringify({ success: true, data: updatedPost, message: "liked post" }));
                } catch (error) {
                    socket.send(JSON.stringify({ success: false, message: error }));
                    return;
                }
            })
            socket.on('unlike-post', async (data: ILike) => {
                try {

                    if (!isValidObjectId(data.id)) {
                        throw new Error('Post id is not valid');
                    }
                    const post = await Post.findById(data.id);
                    if (!post) {
                        throw new Error('Post not found');
                    }
                    const isLiked = await Like.findOne({
                        by: new mongoose.Types.ObjectId(String(socket.userId)),
                        post: new mongoose.Types.ObjectId(String(data.id))
                    })
                    if (!isLiked) {
                        throw new Error('Not  liked this post');
                    }
                    await Like.deleteOne({
                        by: new mongoose.Types.ObjectId(String(socket.userId)),
                        post: new mongoose.Types.ObjectId(String(data.id))
                    })
                    const updatedPost = await Post.findById(data.id).populate("likes comments")
                    socket.send(JSON.stringify({ success: true, data: updatedPost, message: "unliked post" }));
                } catch (error) {
                    socket.send(JSON.stringify({ success: false, message: error }));
                    return;
                }
            })

            socket.on('comment-post', async (data: IComment) => {
                try {

                    if (!isValidObjectId(data.id)) {
                        throw new Error('Post id is not valid');
                    }
                    const post = await Post.findById(data.id);
                    if (!post) {
                        throw new Error('Post not found');
                    }

                    const comment = await Comment.create({
                        by: new mongoose.Types.ObjectId(String(socket.userId)),
                        post: new mongoose.Types.ObjectId(String(data.id)),
                        text: String(data.text)
                    })
                    const updatedPost = await Post.findById(data.id).populate("likes comments")
                    socket.to(`user:${post.createdBy}`).emit("comment-on-your-post", JSON.stringify({ data: comment }))
                    socket.send(JSON.stringify({ success: true, data: updatedPost, message: "comment added" }));
                } catch (error) {
                    socket.send(JSON.stringify({ success: false, message: error }));
                    return;
                }
            })

            socket.on('delete-comment', async (data: IComment) => {
                try {
                    if (!data.commentId) {
                        throw new Error('Comment id is not defined')
                    }
                    if (!isValidObjectId(data.id)) {
                        throw new Error('Post id is not valid');
                    }
                    const post = await Post.findById(data.id);
                    if (!post) {
                        throw new Error('Post not found');
                    }
                    const comment = await Comment.findOne({
                        by: new mongoose.Types.ObjectId(String(socket.userId)),
                        post: new mongoose.Types.ObjectId(String(data.id)),
                        _id: data.commentId
                    });
                    if (!comment) {
                        throw new Error('Comment not found');
                    }
                    await Comment.deleteOne({
                        by: new mongoose.Types.ObjectId(String(socket.userId)),
                        post: new mongoose.Types.ObjectId(String(data.id)),
                        _id: data.commentId
                    })
                    const updatedPost = await Post.findById(data.id).populate("likes comments")
                    socket.send(JSON.stringify({ success: true, data: updatedPost, message: "comment deleted" }));
                } catch (error) {
                    socket.send(JSON.stringify({ success: false, message: error }));
                    return;
                }
            })


        } catch (error) {
            console.error(error);
            socket.disconnect()
        }
    }
)


server.listen(PORT, () => {
    console.log(`Server is running on PORT=${PORT}`)
})

