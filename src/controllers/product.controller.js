import productModel from "../models/products.model.js";
import productCategoryModel from "../models/productCategory.model.js";

export const createProduct = async (req, res) => {
  try {
    const {
      name,
      category,
      roastLevel,
      image,
      description,
      price,
      stock,
      origin,
      recommendations,
      benefits,
      ingredients,
    } = req.body;

    if (await verifyDuplicateName(name)) {
      return res.status(400).json({
        message: `Ya existe un Producto con este Nombre: ${name}`,
      });
    }

    if (await verifyDuplicateRecommendation(recommendations)) {
      return res.status(400).json({
        message: `Ya existe un Producto con esta Recomendación`,
      });
    }

    const foundCategory = await getCategoryByName(category);

    if (!foundCategory) {
      return res.status(404).json({ message: "Categoría no encontrada" });
    }

    const newProduct = new productModel({
      name,
      description,
      roast_level: roastLevel,
      image,
      category: foundCategory._id,
      price,
      stock,
      origin,
      recommendations,
      benefits,
      ingredients,
      enabled: true,
    });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error.message);
  }
};

export const modifyProduct = async (req, res) => {
  try {
    const {
      name,
      category,
      roastLevel,
      image,
      description,
      price,
      stock,
      origin,
      recommendations,
      benefits,
      ingredients,
    } = req.body;

    const oldProduct = await productModel.findOne({ _id: req.params.id });

    if (oldProduct.name !== name) {
      if (await verifyDuplicateName(name)) {
        return res.status(400).json({
          message: `Ya existe un Producto con este Nombre: ${name}`,
        });
      }
    }

    if (oldProduct.recommendations !== recommendations) {
      if (await verifyDuplicateRecommendation(recommendations)) {
        return res.status(400).json({
          message: `Ya existe un Producto con esta Recomendación`,
        });
      }
    }

    let updateData = {
      name,
      description,
      roast_level: roastLevel,
      image,
      price,
      stock,
      origin,
      recommendations,
      benefits,
      ingredients,
    };

    if (category) {
      const foundCategory = await getCategoryByName(category);
      if (foundCategory) {
        updateData.category = foundCategory._id;
      }
    }

    const productUpdated = await productModel
      .findOneAndUpdate({ _id: req.params.id }, updateData, { new: true })
      .populate("category", "name description -_id");

    if (!productUpdated) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    res.status(204).json(productUpdated);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

export const activateProduct = async (req, res) => {
  try {
    const productActivated = await productModel
      .findOneAndUpdate(
        { _id: req.params.id },
        { enabled: true },
        { new: true }
      )
      .populate("category", "name description -_id");

    if (!productActivated) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    res.status(200).json(productActivated);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

export const disableProduct = async (req, res) => {
  try {
    const productDisabled = await productModel
      .findOneAndUpdate(
        { _id: req.params.id },
        { enabled: false },
        { new: true }
      )
      .populate("category", "name description -_id");

    if (!productDisabled) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    res.status(200).json(productDisabled);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

export const searchProductsByParams = async (req, res) => {
  try {
    const params = req.query;
    console.log(params);
    res.json(await getProducts(params));
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

// METODOS NO WEB

const getProducts = async (params) => {
  try {
    const {
      id,
      name,
      category,
      minPrice,
      maxPrice,
      minStock,
      maxStock,
      origin,
      enabled,
    } = params;
    const queries = {};

    if (id) queries._id = id;
    if (name) queries.name = new RegExp(name, "i");
    if (category) {
      const foundCategory = await getCategoryByName(category);
      if (foundCategory) queries.category = foundCategory._id;
    }
    if (minPrice && maxPrice) {
      queries.price = { $gte: minPrice, $lte: maxPrice };
    } else if (minPrice && !maxPrice) {
      queries.price = { $gte: minPrice };
    } else if (maxPrice && !minPrice) {
      queries.price = { $lte: maxPrice };
    }
    if (minStock && maxStock) {
      queries.stock = { $gte: minStock, $lte: maxStock };
    } else if (minStock && !maxStock) {
      queries.stock = { $gte: minStock };
    } else if (maxStock && !minStock) {
      queries.stock = { $lte: maxStock };
    }
    if (origin) queries.origin = new RegExp(origin, "i");
    if (enabled) queries.enabled = enabled;
    else queries.enabled = true;

    console.log(queries);
    const foundProducts = await productModel
      .find(queries)
      .populate("category", "name description -_id");
    return foundProducts;
  } catch (error) {
    console.log(error.message);
    return res.status(500).json(error.message);
  }
};

const getCategoryByName = async (categoryName) => {
  try {
    return await productCategoryModel.findOne({ name: categoryName });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json(error.message);
  }
};

const verifyDuplicateName = async (name) => {
  try {
    const product = await productModel.findOne({ name: name });
    if (product) {
      return true;
    }
    return false;
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
};

const verifyDuplicateRecommendation = async (recommendation) => {
  try {
    const product = await productModel.findOne({
      recommendations: recommendation,
    });
    if (product) {
      return true;
    }
    return false;
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
};
