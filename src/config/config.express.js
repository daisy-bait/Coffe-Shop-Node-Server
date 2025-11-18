import express from "express";
import morgan from "morgan";
import cors from "cors";

import userRoutes from "../routes/user.route.js"
import roleRoutes from "../routes/role.route.js"
import productRoutes from "../routes/product.route.js"
import productCategoryRoutes from "../routes/productCategory.route.js"
import orderRoutes from "../routes/order.route.js"
import blogRoutes from "../routes/blog.route.js"
import commentRoutes from "../routes/comment.route.js"

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
    // CORS Config
    app.use(
        cors({
            credentials: true,
            origin: "http://localhost:5173",
            allowedHeaders: ["Content-Type", "Authorization"]
        })
    )

    app.use(express.json({ limit: '10mb' }));
    app.use(express.urlencoded({ limit: '10mb', extended: true }));
    app.use(morgan('dev'));

    // Rutas, o Endpoints
    app.use("/api/orders", orderRoutes);
    app.use("/api/users", userRoutes);
    app.use("/api/roles", roleRoutes);
    app.use("/api/products", productRoutes);
    app.use("/api/product-categories", productCategoryRoutes);
    app.use("/api/blogs/", blogRoutes);
    app.use("/api/comments/", commentRoutes);
}