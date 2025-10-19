import configEnv from "../config/config.env.js";
import jwt from "jsonwebtoken";
import { getUser, searchUserByParams } from "../controllers/user.controller.js";

export const createAccessToken = async(payload) => {
    return new Promise((resolve, reject) => {
        jwt.sign(payload, configEnv.jwtSecret, { expiresIn: "5s" }, (error, token) => {
            if (error) {
                reject(error);
            }
            resolve(token);
        });
    });
};

export const verifyToken = async(token) => {
    return jwt.verify(token, configEnv.jwtSecret, async(error, claims) => {
        if (error) return false;

        const userFound = await getUser(claims.id, undefined, undefined, undefined);
        if (!userFound) return false;

        return true;
    })
}