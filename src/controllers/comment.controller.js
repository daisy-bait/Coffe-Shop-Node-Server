import commentModel from "../models/comment.model.js";

export const createComment = async (req, res) => {
    try {
        const {
            content,
            userId,
            blogId,
        } = req.body;
        const newComment = new commentModel({
            content,
            user: userId,
            blog: blogId,
            enabled: true,
        });
        await newComment.save();
        return res.status(201).json(newComment);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
};

export const searchCommentsByParams = async (req, res) => {
    try {
        const params = req.query;
        res.json(await getComments(params));
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
};

export const deleteComment = async (req, res) => {
    try {
        const commentId = req.params.id;
        const toDeleteComment = await commentModel.findByIdAndDelete(commentId);
        if (toDeleteComment) {
            return res.json(toDeleteComment);
        }
        return res.status(404).json({ message: "No se encontró el comentario" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message })
    }
}

// METODOS NO WEB

const getComments = async (params) => {
    try {
        const {
            userId,
            blogId,
            enabled,
        } = params;
        const queries = {};
        if (userId) queries.user = userId;
        if (blogId) queries.blog = blogId;
        if (enabled) {
            queries.enabled = enabled;
        }

        const foundComments = await commentModel
        .find(queries)
        .sort({ updatedAt: -1 })
        .populate("user blog");
        return foundComments;
    } catch (error) {
        console.error(error);
        throw new Error(error.message);
    }
};