import configEnv from "../config/config.env";
import jwt from "jsonwebtoken";

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