import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    caption: {
        type: String
    },
    contentUrl: {
        type: String
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true

    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Like",
        required: true
    }],
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
        required: true
    }]
}, { timestamps: true })


export default mongoose.model('Post', postSchema)