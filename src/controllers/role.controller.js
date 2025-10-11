import Role from "../models/role.model.js";

export const getRoleByName = async (req, res) => {
  try {
    const role = await Role.find({ name: req.body.name });
    res.json(role);
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

export const createRole = async (req, res) => {
  try {
    const [ name, description ] = req.body;
    const newRole = new Role({
      name,
      description,
    });
    await newRole.save();
    res.status(201).json(newRole);
  } catch (error) {
    return res.status(500).json(error.message);
  }
};