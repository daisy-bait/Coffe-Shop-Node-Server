import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            unique: true,
        },
        content: {
            type: String,
            required: true,
            unique: true,
        },
        user: {
            type: mongoose.Types.ObjectId,
            ref: "User",
            required: true,
            unique: false,
        },
        image: {
            type: mongoose.Types.ObjectId,
            ref: "Image",
            required: false,
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

export default mongoose.model("Blog", blogSchema);