import mongoose from "mongoose";

const orderDetailsSchema = new mongoose.Schema(
    {
        order: {
            type: mongoose.Types.ObjectId,
            ref: "Order",
            required: true,
            unique: true,
        },
        product: {
            type: mongoose.Types.ObjectId,
            ref: "Product",
            required: true,
            unique: false,
        },
        quantity: {
            type: Number,
            required: true,
            unique: false,
        },
        total_price: {
            type: Number,
            required: true,
            unique: false,
        },
    }
)