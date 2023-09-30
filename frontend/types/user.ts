import { Post } from './post';
import { Comment } from './comment';
import { Like } from './like';

export interface User {
  id: number;
  username: string;
  email: string;
  posts: Post[];
  likes: Like[];
  comments: Comment[];
  createdAt: Date;
  updatedAt: Date;
}
