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
exports.deleteComment = exports.updateComment = exports.createComment = exports.getComments = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getComments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { postId } = req.params;
        const comments = yield prisma.comment.findMany({
            where: { postId: Number(postId) },
            include: { user: true }
        });
        res.status(200).json(comments);
    }
    catch (error) {
        console.error("Error fetching comments", error);
        res.status(500).json({ error: "Error fetching comments" });
    }
});
exports.getComments = getComments;
const createComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { postId } = req.params;
        const { userId, content } = req.body;
        const comment = yield prisma.comment.create({
            data: {
                content,
                userId,
                postId: Number(postId)
            }
        });
        res.status(201).json(comment);
    }
    catch (error) {
        console.error("Error creating comment", error);
        res.status(500).json({ error: "Error creating comment" });
    }
});
exports.createComment = createComment;
const updateComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { commentId } = req.params;
        const { content } = req.body;
        const comment = yield prisma.comment.update({
            where: { id: Number(commentId) },
            data: { content }
        });
        res.status(200).json(comment);
    }
    catch (error) {
        console.error("Error updating comment", error);
        res.status(500).json({ error: "Error updating comment" });
    }
});
exports.updateComment = updateComment;
const deleteComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { commentId } = req.params;
        yield prisma.comment.delete({ where: { id: Number(commentId) } });
        res.status(204).send();
    }
    catch (error) {
        console.error("Error deleting comment", error);
        res.status(500).json({ error: "Error deleting comment" });
    }
});
exports.deleteComment = deleteComment;
