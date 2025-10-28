import ProductCategory from "../models/productCategory.model.js";
import productsModel from "../models/products.model.js";

export const createProductCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const newProductCategory = new ProductCategory({
      name,
      description,
    });
    await newProductCategory.save();
    res.status(201).json(newProductCategory);
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

export const getProductCategory = async (req, res) => {
  try {
    const productCategory = await ProductCategory.find({
      name: req.params.name,
    });
    res.json(productCategory);
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

export const getAllProductCategories = async (req, res) => {
  try {
    const productCategories = await ProductCategory.find();
    res.json(productCategories);
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

export const deleteProductCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;

    const productsWithToDeleteCategory = await productsModel.find({
      category: categoryId,
    });

    const randomCategory = await ProductCategory.findOne({
      _id: { $ne: categoryId },
    });

    if (!randomCategory) {
      return res.status(400).json({
        message:
          "No Existen más Categorías para reemplazar la que se busca eliminar",
      });
    }

    await productsModel.updateMany(
      { category: categoryId },
      { $set: { category: randomCategory._id } }
    );

    const deletedCategory = await ProductCategory.findByIdAndDelete(categoryId);

    return res.status(200).json({
      message: `Categoría eliminada y productos actualizados con categoría ${randomCategory.name}`,
      replacedWith: randomCategory,
      deletedCategory,
      updatedProductsCount: productsWithToDeleteCategory.length,
    });
  } catch (error) {
    return res.status(500).json(error.message);
  }
};
