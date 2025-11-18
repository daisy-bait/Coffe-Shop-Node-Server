import userModel from "../models/user.model.js";
import roleModel from "../models/role.model.js";
import bcrypt from "bcrypt";
import { createAccessToken, verifyToken } from "../libs/jwtUtil.js";
import verificationCodesModel from "../models/verificationCodes.model.js";
import crypto from "crypto";
import nodemailer from "nodemailer";
import configEnv from "../config/config.env.js";

export const registerUser = async (req, res) => {
  try {
    const { username, password, email, name } = req.body;
    const customerRole = await roleModel.findOne({ name: "CUSTOMER" });

    if (await verifyDuplicateUsername(username)) {
      const foundUser = await userModel.findOne({ username: username });
      if (foundUser && foundUser.isVerified) {
        return res.status(400).json({
          message: `Ya existe un Usuario con este Username: ${username}`,
        });
      } else {
        console.log(await userModel.findByIdAndDelete(foundUser._id));
      }
    }

    if (await verifyDuplicateEmail(email)) {
      const foundUserEmail = await userModel.findOne({ email: email });
      if (foundUserEmail && foundUserEmail.isVerified) {
        return res.status(400).json({
          message: `Ya existe un Usuario con este Email: ${email}`,
        });
      } else {
        console.log(await userModel.findByIdAndDelete(foundUserEmail._id));
      }
    }

    if (!customerRole) {
      return res.status(404).json({ message: "Rol no Encontrado: CUSTOMER" });
    }

    const encodedPassword = await bcrypt.hash(password, 10);

    const newUser = new userModel({
      username,
      password: encodedPassword,
      email,
      name,
      roles: [customerRole._id],
      enabled: false,
      isVerified: false,
    });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error.message);
  }
};

export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const registeredUser = await userModel
      .findOne({ username: username, enabled: true })
      .populate("roles", "-_id -__v");

    if (!registeredUser)
      return res
        .status(401)
        .json({ message: "Credenciales Inválidas: Nombre de Usuario" });

    const passwordMatch = await bcrypt.compare(
      password,
      registeredUser.password
    );

    if (!passwordMatch)
      return res
        .status(401)
        .json({ message: "Credenciales Inválidas: Contraseña" });

    const token = await createAccessToken({
      id: registeredUser._id,
      username: registeredUser.username,
      roles: registeredUser.roles,
    });
    res.json(token);
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

export const searchUserByParams = async (req, res) => {
  try {
    const { id, username, email, name, enabled } = req.query;
    res.json(await getUser(id, username, email, name, enabled));
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

export const modifyUser = async (req, res) => {
  try {
    const { username, email, password, name } = req.body;

    const actualUser = await verifyToken(
      req.headers.authorization.split(" ")[1]
    );

    let hasAdminRole = false;

    actualUser.roles.map((role) => {
      if (role.name === "ADMIN") {
        hasAdminRole = true;
      }
    });

    if (!hasAdminRole) {
      if (actualUser._id.toString() !== req.params.id) {
        return res.status(400).json({
          message: `No posees los permisos para editar la información de otro Usuario, Tu ID: ${actualUser._id}, ID de Usuario a Modificar: ${req.params.id}, Tus Roles: ${actualUser.roles}`,
        });
      }
    }

    const oldUser = await userModel.findOne({ _id: req.params.id });

    if (oldUser.username !== username) {
      if (await verifyDuplicateUsername(username)) {
        return res.status(400).json({
          message: `Ya existe un Usuario con este Username: ${username}`,
        });
      }
    }

    const encodedPassword = await bcrypt.hash(password, 10);

    let updateData = {
      username,
      email,
      password: encodedPassword,
      name,
    };

    const userUpdated = await userModel
      .findOneAndUpdate({ _id: req.params.id }, updateData, { new: true })
      .populate("roles", "-_id -__v");

    if (!userUpdated) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.status(204).json(userUpdated);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

export const activateUser = async (req, res) => {
  try {
    const userActivated = await userModel
      .findOneAndUpdate(
        { _id: req.params.id },
        { enabled: true },
        { new: true }
      )
      .populate("roles", "-_id -__v");

    if (!userActivated) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.status(200).json(userActivated);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

export const disableUser = async (req, res) => {
  try {
    const actualUser = await verifyToken(
      req.headers.authorization.split(" ")[1]
    );

    let hasAdminRole = false;

    actualUser.roles.map((role) => {
      if (role.name === "ADMIN") {
        hasAdminRole = true;
      }
    });

    if (!hasAdminRole) {
      if (actualUser._id.toString() !== req.params.id) {
        return res.status(400).json({
          message: `No posees los permisos para inhabilitar otro Usuario, Tu ID: ${actualUser._id}, ID de Usuario a Inhabilitar: ${req.params.id}, Tus Roles: ${actualUser.roles}`,
        });
      }
    }

    const userActivated = await userModel
      .findOneAndUpdate(
        { _id: req.params.id },
        { enabled: false },
        { new: true }
      )
      .populate("roles", "-_id -__v");

    if (!userActivated) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.status(200).json(userActivated);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

export const verifySession = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    res.json(await verifyToken(token));
  } catch (error) {
    console.log(error.message);
  }
};

// PASSWORD RECOVERY && REGISTER CONFIRMATION PENDING
export const requestCode = async (req, res) => {
  try {
    const { email } = req.body;
    const foundUserByEmail = await userModel.findOne({ email: email });

    if (!foundUserByEmail) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    await verificationCodesModel.deleteMany({ email: email });

    // Aquí se genera y envia el código de verificación al correo del usuario
    const code = crypto.randomInt(100000, 1000000).toString();

    const verificationCode = new verificationCodesModel({
      email: email,
      code: code,
      expiresAt: Date.now() + 1 * 60 * 1000, // 5 minutos
    });

    await verificationCode.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "narvaez.kaleth.dev@gmail.com",
        pass: configEnv.mailPassword,
      },
    });

    const mailOptions = {
      from: "narvaez.kaleth.dev@gmail.com",
      to: email,
      subject: "Código de Verificación",
      text: `Tu código de verificación es: ${code}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        return res
          .status(500)
          .json({ message: "Error al enviar el correo", error: error });
      } else {
        console.log("Correo enviado: " + info.response);
        res.status(200).json({ message: "Instrucciones enviadas al correo" });
      }
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: error.message });
  }
};

export const verifyCode = async (req, res) => {
  try {
    const { email, code } = req.body;

    const found = await verificationCodesModel.findOne({ email, code });

    if (!found) {
      return res.status(400).json({ message: "Código incorrecto" });
    }

    if (found.expiresAt < Date.now()) {
      await found.deleteOne();
      return res.status(400).json({ message: "Código expirado" });
    }

    const updatedCode = await found.updateOne({
      _id: found._id,
      verified: true,
    });

    return res
      .status(200)
      .json({ message: "Código validado correctamente", code: updatedCode });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, newPassword, code } = req.body;
    const foundCode = await verificationCodesModel.findOne({
      email,
      code,
      verified: true,
    });

    if (!foundCode) {
      return res
        .status(400)
        .json({ message: "Código no verificado o incorrecto" });
    }

    const encodedPassword = await bcrypt.hash(newPassword, 10);

    const userUpdated = await userModel.findOneAndUpdate(
      { email: email },
      { password: encodedPassword },
      { new: true }
    );
    if (!userUpdated) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    await verificationCodesModel.deleteMany({ email: email });
    return res
      .status(200)
      .json({ message: "Contraseña actualizada correctamente" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const confirmRegister = async (req, res) => {
  try {
    const { email, code } = req.body;
    const foundCode = await verificationCodesModel.findOne({
      email,
      code,
      verified: true,
    });

    if (!foundCode) {
      return res
        .status(400)
        .json({ message: "Código no verificado o incorrecto" });
    }

    const userUpdated = await userModel.findOneAndUpdate(
      { email: email },
      { isVerified: true, enabled: true },
      { new: true }
    );

    if (!userUpdated) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    await verificationCodesModel.deleteMany({ email: email });

    return res
      .status(200)
      .json({ message: "Registro confirmado correctamente" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// METODOS NO WEB

export const getUser = async (id, username, email, name, enabled) => {
  try {
    const queries = {};

    if (id) queries._id = id;
    if (username) queries.username = new RegExp(username, "i");
    if (email) queries.email = new RegExp(email, "i");
    if (name) queries.name = new RegExp(name, "i");
    if (enabled) queries.enabled = enabled;

    const user = await userModel
      .find(queries, { password: 0, __v: 0 })
      .populate("roles", "-_id -__v");

    return user;
  } catch (error) {
    console.log(error.message);
  }
};

const verifyDuplicateUsername = async (username) => {
  try {
    const user = await userModel.findOne({ username: username });
    if (user) {
      return true;
    }
    return false;
  } catch (error) {
    console.log(error);
  }
};

const verifyDuplicateEmail = async (email) => {
  try {
    const user = await userModel.findOne({ email: email });
    if (user) {
      return true;
    }
    return false;
  } catch (error) {
    console.log(error);
  }
};
