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
        roast_level: {
            type: String,
            required: false,
            unique: false,
        },
        image: {
            type: String,
            required: false,
            unique: false,
        },
        category: {
            type: mongoose.Types.ObjectId,
            ref: "ProductCategory",
            required: true,
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
        }],
        ingredients: [{
            type: String,
            required: true,
            unique: false,
        }],
        enabled: {
            type: Boolean,
            required: true,
            unique: false,
        }
    }, {
        timestamps: true,
    }
)

export default mongoose.model("Product", productSchema);