# ☕ Coffee Shop Backend

Backend para una aplicación de tienda de café moderna.  
Construido con **Node.js**, **Express** y **MongoDB**, este servicio provee la API que consumirá el frontend (hecho en React con UIkit).  

El sistema incluye autenticación con JWT, manejo seguro de contraseñas y endpoints para blog, menú, recomendaciones y gestión de usuarios.

---

## 🚀 Features

- **Express REST API** para el frontend.
- **Autenticación JWT** para usuarios.
- **Encriptación de contraseñas** con `bcrypt`.
- **Gestión de productos** (cafés, menú, recomendaciones).
- **Gestión de blog** (artículos relacionados con café).
- **Integración con MongoDB** mediante `mongoose`.
- **Logs de peticiones** con `morgan`.
- **Configuración de entorno** con `dotenv`.
- **Documentación automática** con `jsdoc`.

---

## 📦 Tecnologías y dependencias

```bash
npm i express dotenv bcrypt mongoose morgan jsonwebtoken jsdoc @jsdoc/cli
