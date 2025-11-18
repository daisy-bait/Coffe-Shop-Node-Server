import { Router } from "express";
import {
  loginUser,
  registerUser,
  modifyUser,
  searchUserByParams,
  verifySession,
  activateUser,
  disableUser,
  requestCode,
  verifyCode,
  resetPassword,
  confirmRegister,
  updateUserRoles,
  deleteUserRoles,
} from "../controllers/user.controller.js";
import { auth } from "../middlewares/auth.middleware.js";

const router = new Router();

router.post("/register/", registerUser);

router.put("/modify/:id", auth(["ADMIN", "CUSTOMER"]), modifyUser);

router.post("/login/", loginUser);

router.get("/search/", searchUserByParams);

router.get("/verify-session/", verifySession);

router.patch("/activate/:id", auth(["ADMIN"]), activateUser);

router.delete("/disable/:id", auth(["ADMIN", "CUSTOMER"]), disableUser);

// Ruta para Recuperar Contraseña y Confirmación de Email en Registro

router.post("/request-code", requestCode);

router.post("/verify-code", verifyCode);

router.post("/reset-password", resetPassword);

router.post("/confirm-email/", confirmRegister);

// Gestión de roles

router.patch("/update-role/:id", updateUserRoles);

router.patch("/delete-role/:id", deleteUserRoles);

export default router;
