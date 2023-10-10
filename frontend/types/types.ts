// types.ts

// Comment type
export interface Comment {
  user: any;
  id: number;
  content: string;
  userId: number;
  postId: number;
  createdAt: Date;
  updatedAt: Date;
}

// Like type
export interface Like {
  id: number;
  userId: number;
  postId: number;
  createdAt: Date;
}

// Post type
export interface Post {
  user: any;
  id: number;
  imageUrl: string;
  caption?: string;
  userId: number;
  likes: Like[];
  comments: Comment[];
  createdAt: Date;
  updatedAt: Date;
}

// User type
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
