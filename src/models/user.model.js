import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
            unique: false,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        name: {
            type: String,
            required: true,
            unique: false,
        },
        roles: [{
            type: mongoose.Types.ObjectId,
            ref: "Role",
            required: true,
            unique: false,
        }],
    },
    {
        timestamps: true,
    }
)

export default mongoose.model("User", userSchema);