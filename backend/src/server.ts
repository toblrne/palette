import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import postRoutes from './routes/postRoutes';
import userRoutes from './routes/userRoutes';
import commentRoutes from './routes/commentRoutes';
import likeRoutes from './routes/likeRoutes';

dotenv.config();

const app = express();
const PORT = 3001;

app.use(express.json());
app.use('/posts', postRoutes);
app.use('/posts/:postId/comments', commentRoutes);
app.use('/posts/:postId/likes', likeRoutes);
app.use('/users', userRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello from Express with TypeScript!');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
