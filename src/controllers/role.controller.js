import roleModel from "../models/role.model.js";

export const createRole = async (req, res) => {
  try {
    const { name, description } = req.body;
    const newRole = new roleModel({
      name,
      description,
    });
    await newRole.save();
    res.status(201).json(newRole);
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

export const getRoleByName = async (req, res) => {
  try {
    const role = await roleModel.find({ name: req.body.name });
    res.json(role);
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

export const getAllRoles = async (req, res) => {
  try {
    const roles = await roleModel.find();
    res.json(roles);
  } catch (error) {
    return res.status(500).json(error.message);
  }
};