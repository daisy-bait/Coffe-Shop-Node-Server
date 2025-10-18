import userModel from "../models/user.model";
import roleModel from "../models/role.model";

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
    } catch {
        return res.status(500).json(error.message);
    }
};