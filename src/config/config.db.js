import mongoose from "mongoose";

export const configDb = async (env) => {
    try {
        await mongoose.connect(env.mongo);
        console.log("MongoDB is Connected");
    } catch(error) {
        console.error(error);
    }
}