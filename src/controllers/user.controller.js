import userModel from "../models/user.model.js";
import roleModel from "../models/role.model.js";

export const registerUser = async (req, res) => {
    try {
        const { username, password, email, name } = req.body;
        const customerRole = roleModel.find({ name: 'CUSTOMER' });
        const roles = [ customerRole ];
        const newUser = new userModel(
            username,
            password,
            email,
            name,
            roles
        )
        await newUser.save();
        res.status(201).json(newUser);
    } catch(error) {
        return res.status(500).json(error.message);
    }
};

export const searchUserByParams = async (req, res) => {
    try {
        const { id, username, email, name } = req.query;
        console.log(id, username, email, name);
        res.json(this.getUser(id, username, email, name));
    } catch(error) {
        return res.status(500).json(error.message);
    }
};

export const getUser = async (id, username, email, name) => {
    try {
        const user = await userModel.find({
            _id: id,
            username: username,
            email: email,
            name: name
        })
    } catch(error) {
        return res.status(500).json(error.message);
    }
};