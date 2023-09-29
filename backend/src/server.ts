import express, { Request, Response } from 'express';

import session from 'express-session';
import connectRedis from 'connect-redis';

import { redis } from './util/redis';
import cors from 'cors';

import postRoutes from './routes/postRoutes';
import userRoutes from './routes/userRoutes';
import commentRoutes from './routes/commentRoutes';
import likeRoutes from './routes/likeRoutes';

require('dotenv').config();

const app = express();
const PORT = 3001;

app.use(express.json());

const RedisStore = connectRedis(session);
const redisStoreInstance = new RedisStore({ client: redis });

app.use(
  cors({
    origin:
      process.env.NODE_ENV === 'production'
        ? process.env.PRODUCTION_URL
        : 'http://localhost:3000', // Adjust as needed
    credentials: true,
  })
);

app.use(
  session({
    name: 'pale', // You can replace this with a name related to your project
    store: redisStoreInstance,
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      domain: process.env.NODE_ENV === 'production' ? '.yourDomain.com' : undefined,
    },
  })
);

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
