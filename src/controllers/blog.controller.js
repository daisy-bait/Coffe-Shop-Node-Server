import imageModel from "../models/image.model.js";
import blogModel from "../models/blog.model.js";
import userModel from "../models/user.model.js";

export const createBlog = async (req, res) => {
    try {
        const {
            title,
            content,
            image,
            userId,
        } = req.body;

        console.log(title, content, image, userId);

        if (await verifyDuplicateTitle(title)) {
            return res.status(400).json({
                message: `Ya existe un Blog con este Título: ${title}`,
            });
        }

        if (await verifyDuplicateContent(content)) {
            return res.status(400).json({
                message: `Ya existe un Blog con este Contenido`,
            });
        }

        let newImage = null;

        if (image) {
            newImage = new imageModel({
                source: image.source,
            });
            await newImage.save();
        }

        const newBlog = new blogModel({
            title,
            content,
            user: userId,
            image: newImage,
            enabled: true,
        });
        await newBlog.save();
        return res.status(201).json(newBlog);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
}

export const searchBlogByParams = async (req, res) => {
    try {
        const params = req.query;
        res.json(await getBlogs(params));
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
}

// METODOS NO WEB

const verifyDuplicateTitle = async (title) => {
    try {
    const blogFound = await blogModel.findOne({ title: title });
    return blogFound ? true : false;
    } catch (error) {
        console.error(error);
        throw new Error(error.message);
    }
}

const verifyDuplicateContent = async (content) => {
    try {
    const blogFound = await blogModel.findOne({ content: content });
    return blogFound ? true : false;
    } catch (error) {
        console.error(error);
        throw new Error(error.message);
    }
}

const getBlogs = async (params) => {
    try {
        const {
            title,
            username,
            enabled,
        } = params;
        const queries = {};

        if (title) queries.title = new RegExp(title, "i");
        if (username) {
            const foundUsers = await getUserByUsername(username);
            if (foundUsers.length > 0) {
                queries.user = { $in: foundUsers.map(user => user._id) };
            } else {
                return [];
            }
        }
        if (enabled) {
            queries.enabled = enabled;
        } else {
            queries.enabled = true;
        }

        const foundBlogs = await blogModel
        .find(queries)
        .populate("image user");
        return foundBlogs;
    } catch (error) {
        console.error(error);
        throw new Error(error.message);
    }
}

const getUserByUsername = async (username) => {
    try {
        return await userModel.find({ username: new RegExp(username, "i") });
    } catch(error) {
        console.error(error);
        throw new Error(error.message);
    }
}