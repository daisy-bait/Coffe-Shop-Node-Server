import ProductCategory from "../models/productCategory.model.js";

export const createProductCategory = async(req, res) => {
    try {
        const { name, description } = req.body;
        const newProductCategory = new ProductCategory({
            name,
            description
        })
        await newProductCategory.save();
        res.status(201).json(newProductCategory);
    } catch(error) {
        return res.status(500).json(error.message);
    }
}

export const getProductCategory = async(req, res) => {
    try {
        const productCategory = await ProductCategory.find({ name: req.params.name });
        res.json(productCategory);
    } catch(error) {
        return res.status(500).json(error.message);
    }
};

export const getAllProductCategories = async(req, res) => {
    try {
        const productCategories = await ProductCategory.find();
        res.json(productCategories);
    } catch(error) {
        return res.status(500).json(error.message);
    }
};