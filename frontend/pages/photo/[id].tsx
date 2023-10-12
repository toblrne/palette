import { useRouter } from 'next/router';
import { FormEvent, useEffect, useState } from 'react';
import axios from 'axios';
import { Post, Comment } from '../../types/types'
import { Box, Input, Divider, Heading, Image, Flex, Text, Button, FormControl, FormLabel } from '@chakra-ui/react';
import Head from 'next/head';
import Navbar from '../../components/Navbar';
import { Like, User } from '../../types/types'
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { DeleteIcon } from '@chakra-ui/icons'
import Link from 'next/link';
import { GetServerSideProps } from 'next';

interface PhotoPageProps {
  initialPost: Post | null;
  initialComments: Comment[];
  user: User | null;
}

const PhotoPage: React.FC<PhotoPageProps> = ({ initialPost, initialComments, user }) => {
  const router = useRouter();
  const { id } = router.query;

  const [post, setPost] = useState<Post | null>(initialPost);
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState<string>('');


  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newComment) return;

    try {
      const response = await axios.post(`http://localhost:3001/posts/${id}/comments`, {
        userId: user?.id,
        content: newComment,
      });

      const newPostedComment = {
        ...response.data,
        user: { username: user?.username }
      };
      setComments((prevComments) => [...prevComments, newPostedComment]);

      setNewComment('');
    } catch (error) {
      console.error("Error creating comment:", error);
    }
  };

  const handleLike = async () => {
    try {
      const response = await axios.post(`http://localhost:3001/posts/${id}/likes`, {
        userId: user?.id
      });

      const newLike = response.data;  

      setPost(prevPost => {
        if (!prevPost) return null;
        return {
          ...prevPost,
          likes: [...prevPost.likes, newLike]
        };
      });
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };


  const handleUnlike = async () => {
    if (!post || !user) return;

    const like = post.likes.find(l => l.userId === user.id);

    if (!like) return;

    try {
      await axios.delete(`http://localhost:3001/posts/${post.id}/likes/${like.id}`);

      setPost(prevPost => {
        if (!prevPost) return null;

        const updatedLikes = prevPost.likes.filter(l => l.userId !== user.id);

        return {
          ...prevPost,
          likes: updatedLikes
        };
      });
    } catch (error) {
      console.error("Error unliking the post:", error);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    try {
      await axios.delete(`http://localhost:3001/posts/${id}/comments/${commentId}`, {
        data: { userId: user?.id }
      });
      setComments(prevComments => prevComments.filter(comment => comment.id !== commentId));
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };


  return (
    <Flex minH="100vh" minW="100vh" direction="column" overflow="scroll">
      <Head>
        <title>Upload Photo</title>
      </Head>
      <Navbar user={user} />
      {post ? (
        <Flex m={30} justify="center">
          <Box flex="1" width="50%" position="relative">
            <Image src={post.imageUrl} alt={post.caption} objectFit="cover" width="100%" height="100%" />
          </Box>
          <Flex
            flex="1"
            width="50%"
            ml={8}
            direction="column"
            border="1px black solid"
            borderRadius="8px"
            p="2"
          >
            <Flex direction="column" height="100%">
              <Flex direction="column" >
                <Flex direction="row" align="center">
                  <Heading size="lg" mr="auto">{post.caption}</Heading>
                  {post && user && post.likes.some(l => l.userId === user.id) ? (
                    <Box onClick={handleUnlike} cursor="pointer" display="flex" alignItems="center">
                      <FaHeart color="red" />
                      <Text ml={2}>{post.likes.length}</Text>
                    </Box>
                  ) : (
                    <Box onClick={handleLike} cursor="pointer" display="flex" alignItems="center">
                      <FaRegHeart color="gray" />
                      <Text ml={2}>{post.likes.length}</Text>
                    </Box>
                  )}
                </Flex>
                <Divider my={4} />

                {/* Comments display section */}
                <Box overflowY="auto" height={{ sm: `260px`, md: "460px", lg: "820px" }}>
                  {comments.map(comment => (
                    <Flex key={comment.id} mb="4" align="center" justify="space-between">
                      <Box flex="1">
                        <Link href={`/${comment.user.id}/photos`}>
                          <Text as="span" fontWeight="bold">{comment.user.username}: </Text>
                        </Link>
                        <Text as="span">{comment.content}</Text>
                      </Box>
                      {user && user.id === comment.userId ? (
                        <Button h={8}
                          onClick={() => handleDeleteComment(comment.id)}
                          cursor="pointer"
                        >
                          <DeleteIcon />
                        </Button>
                      ) : (
                      
                        <Box width={6} height={8}></Box>
                      )}
                    </Flex>
                  ))}
                </Box>
              </Flex>

              {/* Comment form */}

            </Flex>
            {user && <Box as="form" mt="4" onSubmit={handleCommentSubmit}>
              <Flex>
                <FormControl flex="1" mr="2">
                  <Input
                    id="newComment"
                    placeholder="write a comment"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                  />
                </FormControl>
                <Button alignSelf="flex-end" type="submit">Submit</Button>
              </Flex>
            </Box>}
          </Flex>

        </Flex >
      ) : (
        <p>Loading...</p>
      )
      }
    </Flex >
  );
};

export default PhotoPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const postId = context.query.id as string;
  let post: Post | null = null;
  let comments: Comment[] = [];
  let user: User | null = null;

  try {
    const postResponse = await axios.get(`http://localhost:3001/posts/${postId}`);
    post = postResponse.data;

    const commentsResponse = await axios.get(`http://localhost:3001/posts/${postId}/comments`);
    comments = commentsResponse.data;

   
    const userRes = await axios.get('http://localhost:3001/users/me', {
      headers: {
        cookie: context.req.headers.cookie,
      },
    });
    user = userRes.data.user;
  } catch (error) {
    console.error("Error fetching post, comments, and user:", error);
  }

  return {
    props: {
      initialPost: post,
      initialComments: comments,
      user: user,
    },
  };
};