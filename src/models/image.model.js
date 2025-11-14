import mongoose from "mongoose";

const imageSchema = new mongoose.Schema(
    {
        source: {
            type: String,
            required: true,
            unique: false,
        }
    }
);

export default mongoose.model("Image", imageSchema);