import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
        client: {
            type: mongoose.Types.ObjectId,
            ref: "User",
            required: true,
            unique: false,
        },
        order_details: [{
            type: mongoose.Types.ObjectId,
            ref: "OrderDetail",
            required: true,
            unique: false,
        }],
        total_price: {
            type: Number,
            required: true,
            unique: false,
        },
        status: {
            type: String,
            required: true,
            unique: false
        }
    }, {
        timestamps: true,
    }
)

export default mongoose.model("Order", orderSchema);