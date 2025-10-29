import roleModel from "../models/role.model.js";
import userModel from "../models/user.model.js";
import bcrypt from "bcrypt";

export const runDataLoader = async() => {
    const savedRoles = await roleModel.find().exec();
    const savedUsers = await userModel.find().exec();

    if (savedRoles.length === 0) {
        console.log("[MONGO] Seeding Roles...")

        const roles = [
            new roleModel({
                name: "ADMIN",
                description: "Role with administration functions",
            }),
            new roleModel({
                name: "CUSTOMER",
                description: "Role with user functions",
            })
        ].map(role => role.save());
    }

    if (savedUsers.length === 0) {
        console.log("[MONGO] Seeding Users...")

        const roleAdmin = await roleModel.find({ name: "ADMIN" }).exec();
        const roles = [ roleAdmin[0] ];
        const encodedPassword = await bcrypt.hash("Kaleth_2006", 10);

        const users = [
            new userModel({
                username: "admin",
                password: encodedPassword,
                email: "u20231213624@usco.edu.co",
                name: "Kaleth Daniel Narváez Paredes",
                roles: roles,
                enabled: true
            })
        ].map(user => user.save());

        console.log("[MONGO] Finishing Seeders...")
    }

}