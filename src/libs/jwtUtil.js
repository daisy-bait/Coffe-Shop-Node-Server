import configEnv from "../config/config.env";
import jwt from "jsonwebtoken";
import { getUser, searchUserByParams } from "../controllers/user.controller.js";

export const createAccessToken = async(payload) => {
    return new Promise((resolve, reject) => {
        jwt.sign(payload, configEnv.jwtSecret, { expiresIn: "1d" }, (error, token) => {
            if (error) {
                reject(error);
            }
            resolve(token);
        });
    });
};

export const verifyToken = async(token) => {
    jwt.verify(token, configEnv.jwtSecret, async(error, claims) => {
        if (error) return false;

        const userFound = await getUser(claims.id, undefined, undefined, undefined);
        if (!userFound) return false;

        const userData = {
            id: userFound._id,
            username: userFound.username,
            email: userFound.email,
            name: userFound.name,
            roles: userFound.roles
        };

        return userData;
    })
}