import Role from "../models/role.model.js";

export const getRoleByName = async (req, res) => {
  try {
    const role = await Role.find({ name: req.body.name });
    res.json(role);
  } catch (error) {
    console.error(error);
    return res.status(500).json(error.message);
  }
};

export const createRole = async (req, res) => {
  try {
    let name = req.body.name;
    const newRole = new Role({
      name,
    });
    await newRole.save();
    res.status(201).json(newRole);
  } catch (error) {
    console.error(error);
    return res.status(500).json(error.message);
  }
};