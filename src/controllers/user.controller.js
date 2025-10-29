import userModel from "../models/user.model.js";
import roleModel from "../models/role.model.js";
import bcrypt from "bcrypt";
import { createAccessToken, verifyToken } from "../libs/jwtUtil.js";

export const registerUser = async (req, res) => {
  try {
    const { username, password, email, name } = req.body;
    const customerRole = await roleModel.findOne({ name: "CUSTOMER" });

    if (await verifyDuplicateUsername(username)) {
      return res.status(400).json({
        message: `Ya existe un Usuario con este Username: ${username}`,
      });
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
      enabled: true,
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

// METODOS NO WEB

export const getUser = async (id, username, email, name, enabled) => {
  try {
    const queries = {};

    if (id) queries._id = id;
    if (username) queries.username = new RegExp(username, "i");
    if (email) queries.email = new RegExp(email, "i");
    if (name) queries.name = new RegExp(name, "i");
    if (enabled) queries.enabled = enabled;
    else queries.enabled = true;

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
