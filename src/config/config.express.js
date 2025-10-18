import express from "express";
import morgan from "morgan";

import userRoutes from "../routes/user.route.js"
import roleRoutes from "../routes/role.route.js"
import productRoutes from "../routes/product.route.js"
import productCategoryRoutes from "../routes/productCategory.route.js"

/**
 * @description Función para configurar express para:
 * <ol>
 *  <li>1. Soporte JSON</li>
 *  <li>2. Maneje Codificación de URL</li>
 *  <li>3. Registre los consumos HTTP en la consola mediante Morgan</li>
 * </ol>
 * @param {express} app
 */
export default function(app) {
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(morgan('dev'));

    // Rutas, o Endpoints
    app.use("/api/users", userRoutes);
    app.use("/api/roles", roleRoutes);
    app.use("/api/products", productRoutes);
    app.use("/api/product-categories", productCategoryRoutes);
}