import mongoose from "mongoose";

const orderDetailsSchema = new mongoose.Schema(
    {
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

export default mongoose.model("OrderDetail", orderDetailsSchema);