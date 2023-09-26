"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePost = exports.updatePost = exports.getPostById = exports.getAllPosts = exports.createPost = exports.getPresignedUrl = void 0;
const s3_1 = require("../util/s3");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getPresignedUrl = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fileName, fileType } = req.query;
        if (typeof fileName !== 'string' || typeof fileType !== 'string') {
            return res.status(422).send("Invalid fileName or fileType");
        }
        const { signedUrl, url } = yield (0, s3_1.getSignedUrl)({ fileName, fileType });
        res.status(200).json({ presignedURL: signedUrl, url });
    }
    catch (error) {
        console.error("Error generating presigned URL", error);
        res.status(500).json({ error: "Error generating presigned URL" });
    }
});
exports.getPresignedUrl = getPresignedUrl;
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, imageUrl, caption } = req.body;
        if (typeof userId !== 'number' || typeof imageUrl !== 'string') {
            return res.status(422).send("Invalid userId or imageUrl");
        }
        const userExists = yield prisma.user.findUnique({ where: { id: userId } });
        if (!userExists)
            return res.status(404).json({ error: "User not found" });
        const post = yield prisma.post.create({
            data: {
                userId,
                imageUrl,
                caption,
            },
        });
        res.status(201).json(post);
    }
    catch (error) {
        console.error("Error creating post", error);
        res.status(500).json({ error: "Error creating post" });
    }
});
exports.createPost = createPost;
const getAllPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const posts = yield prisma.post.findMany({
            include: {
                user: true,
                comments: true,
                likes: true,
            },
        });
        res.status(200).json(posts);
    }
    catch (error) {
        console.error("Error getting posts", error);
        res.status(500).json({ error: "Error getting posts" });
    }
});
exports.getAllPosts = getAllPosts;
const getPostById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const postId = Number(req.params.postId);
        const post = yield prisma.post.findUnique({
            where: { id: postId },
            include: {
                user: true,
                comments: true,
                likes: true,
            },
        });
        if (!post)
            return res.status(404).json({ error: "Post not found" });
        res.status(200).json(post);
    }
    catch (error) {
        console.error("Error getting post", error);
        res.status(500).json({ error: "Error getting post" });
    }
});
exports.getPostById = getPostById;
const updatePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const postId = Number(req.params.postId);
        const { caption } = req.body;
        const post = yield prisma.post.update({
            where: { id: postId },
            data: { caption },
        });
        res.status(200).json(post);
    }
    catch (error) {
        console.error("Error updating post", error);
        res.status(500).json({ error: "Error updating post" });
    }
});
exports.updatePost = updatePost;
const deletePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const postId = Number(req.params.postId);
        yield prisma.post.delete({ where: { id: postId } });
        res.status(204).send();
    }
    catch (error) {
        console.error("Error deleting post", error);
        res.status(500).json({ error: "Error deleting post" });
    }
});
exports.deletePost = deletePost;
