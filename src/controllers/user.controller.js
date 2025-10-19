import userModel from "../models/user.model.js";
import roleModel from "../models/role.model.js";
import bcrypt from "bcrypt";
import { createAccessToken, verifyToken } from "../libs/jwtUtil.js";

export const registerUser = async (req, res) => {
    try {
        const { username, password, email, name } = req.body;
        const customerRole = roleModel.find({ name: 'CUSTOMER' });
        const roles = [ customerRole ];
        const encodedPassword = await bcrypt.hash(password, 10);

        const newUser = new userModel({
            username,
            password: encodedPassword,
            email,
            name,
            roles
    });
        await newUser.save();
        res.status(201).json(newUser);
    } catch(error) {
        return res.status(500).json(error.message);
    }
};

export const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        const registeredUser = await userModel.findOne({ username: username });

        if (!registeredUser)
            return res.status(401).json({ message: "Invalid Credentials: Not User Found" });

        const passwordMatch = await bcrypt.compare(password, registeredUser.password);

        if (!passwordMatch)
            return res.status(401).json({ message: "Invalid Credentials: Incorrect Password" });

        const token = await createAccessToken({
            id: registeredUser._id,
            username: registeredUser.username,
            roles: registeredUser.roles
        })
        res.json(token);
    } catch(error) {
        return res.status(500).json(error.message);
    }
};

export const searchUserByParams = async (req, res) => {
    try {
        const { id, username, email, name } = req.query;
        res.json(await getUser(id, username, email, name));
    } catch(error) {
        return res.status(500).json(error.message);
    }
};

export const verifySession = async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        res.json(await verifyToken(token));
    } catch(error) {
        console.log(error.message);
    }
};

// METODOS PRIVADOS

export const getUser = async (id, username, email, name) => {
    try {
        const queries = {};

        if (id) queries._id = id;
        if (username) queries.username = new RegExp(username, "i");
        if (email) queries.email = new RegExp(email, "i");
        if (name) queries.name = new RegExp(name, "i");

        const user = await userModel.find(
            queries, { password: 0, __v: 0 }
        ).populate("roles", "-_id -__v");
        return user;
    } catch(error) {
        console.log(error.message);
    }
};