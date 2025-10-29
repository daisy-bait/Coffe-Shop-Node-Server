import mongoose from "mongoose";

const productCategorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true
        },
        description: {
            type: String,
            required: false,
            unique: false
        }
    }
)

export default mongoose.model("ProductCategory", productCategorySchema);