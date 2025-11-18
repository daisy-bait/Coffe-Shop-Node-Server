import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
    {
        content: {
            type: String,
            required: true,
            unique: false,
        },
        user: {
            type: mongoose.Types.ObjectId,
            ref: "User",
            required: true,
            unique: false,
        },
        blog: {
            type: mongoose.Types.ObjectId,
            ref: "Blog",
            required: true,
            unique: false,
        },
        enabled: {
            type: Boolean,
            required: true,
            unique: false,
        }
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("Comment", commentSchema);