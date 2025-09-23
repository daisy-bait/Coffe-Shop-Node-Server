import dotenv from "dotenv";

/**
 * Archivo para cargar las variables de entorno de .env
 */
dotenv.config();

export default {
    port: process.env.PORT || '0000',
    mongo: process.env.MONGO_URL || 'mongodb://localhost:5432/database',
    jwtSecret: process.env.TOKEN_SECRET || '!"#$%&/()=1234567890'
}