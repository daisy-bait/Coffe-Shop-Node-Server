import Product from "../models/products.model.js"

export const getProduct = async(req, res) => {
    try {
        const product = await Product.find({ _id: req.params.id }).populate("category", "name description -_id");
        res.json(product);
    } catch(error) {
        return res.status(500).json(error.message);
    }
};

export const createProduct = async(req, res) => {
    try {
        const { name, description, price, stock, origin, recommendations, benefits } = req.body;
        const category = req.body.category.id;

        const newProduct = new Product({
            name,
            description,
            category,
            price,
            stock,
            origin,
            recommendations,
            benefits
        })
        await newProduct.save();
        res.status(201).json(newProduct);
    } catch(error) {
        return res.status(500).json(error.message);
    }
}