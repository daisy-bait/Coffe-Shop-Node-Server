import mongoose from "mongoose";

/**
 * @description Función para configurar la conexión a MongoDB para:
 * @param {express} app
 */
export const configDb = async (env) => {
    try {
        await mongoose.connect(env.mongo);
        console.log("MongoDB is Connected");
    } catch(error) {
        console.error(error);
    }
}