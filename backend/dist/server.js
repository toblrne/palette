"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const postRoutes_1 = __importDefault(require("./routes/postRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const commentRoutes_1 = __importDefault(require("./routes/commentRoutes"));
const likeRoutes_1 = __importDefault(require("./routes/likeRoutes"));
require('dotenv').config();
const app = (0, express_1.default)();
const PORT = 3001;
app.use(express_1.default.json());
app.use('/posts', postRoutes_1.default);
app.use('/posts/:postId/comments', commentRoutes_1.default);
app.use('/posts/:postId/likes', likeRoutes_1.default);
app.use('/users', userRoutes_1.default);
app.get('/', (req, res) => {
    res.send('Hello from Express with TypeScript!');
});
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
