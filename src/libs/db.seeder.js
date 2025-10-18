import roleModel from "../models/role.model.js";
import userModel from "../models/user.model.js";

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

        const roleAdmin = roleModel.find({ name: "ADMIN" });

        const users = [
            new userModel({
                username: "admin",
                password: "200548",
                email: "u20231213624@usco.edu.co",
                name: "Kaleth Daniel Narváez Paredes",
                roles: [ roleAdmin ]
            })
        ].map(user => user.save());

        console.log("[MONGO] Finishing Seeders...")
    }

}