import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
        },
        description: {
            type: String,
            required: false,
            unique: false,
        },
        category: {
            type: mongoose.Types.ObjectId,
            ref: "ProductCategory",
        },
        price: {
            type: Number,
            required: true,
            unique: false,
            min: 0,
        },
        stock: {
            type: Number,
            required: true,
            unique: false,
            min: 0,
        },
    }, {
        timestamps: true,
    }
)