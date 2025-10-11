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
            required: false,
            unique: false,
        },
        price: {
            type: Number,
            required: true,
            unique: false,
            min: 0,
        },
        stock: {
            type: Number,
            required: false,
            unique: false,
            min: 0,
        },
        origin: {
            type: String,
            required: false,
            unique: false,
        },
        recommendations: {
            type: String,
            required: true,
            unique: true,
        },
        benefits: [{
            type: String,
            required: false,
            unique: false,
        }]
    }, {
        timestamps: true,
    }
)

export default mongoose.model("Product", productSchema);