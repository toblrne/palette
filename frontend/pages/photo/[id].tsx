import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Post, Comment } from '../../types/types'

const PhotoPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    const fetchPostAndComments = async () => {
      if (!id) return;

      try {
        // Fetch the post
        const postResponse = await axios.get(`http://localhost:3001/posts/${id}`);
        setPost(postResponse.data);

        // Fetch the comments for the post
        // Assuming your backend provides a route like this based on the post's ID
        const commentsResponse = await axios.get(`http://localhost:3001/posts/${id}/comments`);
        setComments(commentsResponse.data);
      } catch (error) {
        console.error("Error fetching post and comments:", error);
      }
    };

    fetchPostAndComments();
  }, [id]);

  console.log(post)

  return (
    <div>
      {post ? (
        <div>
          <img src={post.imageUrl} alt={post.caption} />
          <p>{post.caption}</p>
          <div>
            {post.user && <span>Posted by: {post.user.username}</span>}
            {post.likes && <span>Likes: {post.likes.length}</span>}
            {/* You can also add functionalities to like the post or comment on it */}
          </div>
          <div>
            <h3>Comments:</h3>
            {comments.map(comment => (
              <div key={comment.id}>
                <span>{comment.user.username}: </span>
                <span>{comment.content}</span>
              </div>
            ))}
            {/* Add a form here to post a new comment */}
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default PhotoPage;
