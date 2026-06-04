import mongoose from "mongoose";

const likeSchema = new mongoose.Schema({
    by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true

    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        required: true

    },

}, { timestamps: true })


likeSchema.index({ by: 1, post: 1 }, { unique: true })

export default mongoose.model('Like', likeSchema)