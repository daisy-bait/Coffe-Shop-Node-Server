import express from "express";
import configEnv from "./config/config.env.js";
import configExpress from "./config/config.express.js";
import { configDb } from "./config/config.db.js"
import { runDataLoader } from "./libs/db.seeder.js";

/**
 * Cargamos la constante de todas las utilidades de express, le ponemos app, pero puede llamarse como queramos
 */
const app = express();

/**
 * Configuramos express de una vez mediante nuestra clase de Utilidad
 * Se configura aparte para no acaparar mucho código en este archivo
 * Nota: Aquí estamos configurando las Rutas, o Endpoints
 */
configExpress(app);

/**
 * Configuramos la conexión a Base de Datos MongoDB dentro de la configuración del servidor
 */
try {
  await configDb(configEnv);
  app.listen(configEnv.port, async() => {
    await runDataLoader();
    console.log(`Listening on port ${configEnv.port}`);
  });
} catch (error) {
  console.error(error);
  process.exit(1);
}
