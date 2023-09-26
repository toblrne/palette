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
exports.deleteLike = exports.createLike = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createLike = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { postId } = req.params;
        const { userId } = req.body;
        const like = yield prisma.like.create({
            data: {
                userId,
                postId: Number(postId)
            }
        });
        res.status(201).json(like);
    }
    catch (error) {
        console.error("Error creating like", error);
        res.status(500).json({ error: "Error creating like" });
    }
});
exports.createLike = createLike;
const deleteLike = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { likeId } = req.params;
        yield prisma.like.delete({
            where: { id: Number(likeId) }
        });
        res.status(204).send();
    }
    catch (error) {
        console.error("Error deleting like", error);
        res.status(500).json({ error: "Error deleting like" });
    }
});
exports.deleteLike = deleteLike;
