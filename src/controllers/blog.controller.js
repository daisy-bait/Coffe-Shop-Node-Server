import imageModel from "../models/image.model";

export const createBlog = async (req, res) => {
    try {
        const {
            title,
            content,
            image,
            userId,
        } = req.body;

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

        newImage = null;

        if (image) {
            newImage = new imageModel({
                source: image.source,
                isB64: image.isB64,
            });
            await newImage.save();
        }

        newBlog = new blogModel({
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