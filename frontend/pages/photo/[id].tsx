import { useRouter } from 'next/router';
import { FormEvent, useEffect, useState } from 'react';
import axios from 'axios';
import { Post, Comment } from '../../types/types'
import { Box, Input, Divider, Heading, Image, Flex, Text, Button, FormControl, FormLabel } from '@chakra-ui/react';
import Head from 'next/head';
import Navbar from '../../components/Navbar';
import useCurrentUser from '../../hooks/useCurrentUser';

const PhotoPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const { user, setUser } = useCurrentUser();

  console.log(user)

  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState<string>('');

  useEffect(() => {
    const fetchPostAndComments = async () => {
      if (!id) return;

      try {
        const postResponse = await axios.get(`http://localhost:3001/posts/${id}`);
        setPost(postResponse.data);

        const commentsResponse = await axios.get(`http://localhost:3001/posts/${id}/comments`);
        setComments(commentsResponse.data);
      } catch (error) {
        console.error("Error fetching post and comments:", error);
      }
    };

    fetchPostAndComments();
  }, [id]);

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

  return (
    <Flex minH="100vh" minW="100vh" direction="column" overflow="scroll">
      <Head>
        <title>Upload Photo</title>
      </Head>
      <Navbar user={user} setUser={setUser} />
      {post ? (
        <Flex m={30} justify="center">
          <Box
            position="relative"
            width={{ sm: `320px`, image: "480px", md: "600px", lg: "800px" }}
            height={{ sm: `260px`, image: "370px", md: "460px", lg: "620px" }}
          >
            <Image src={post.imageUrl} alt={post.caption} objectFit='cover' />
          </Box>
          <Flex
            ml={8}
            grow={1}
            width={{ sm: `320px`, image: "480px", md: "600px", lg: "800px" }}
            height={{ sm: `260px`, image: "370px", md: "460px", lg: "620px" }}
            direction="column"
            border="1px black solid"
            borderRadius="8px"
            p="2"
          >
            <Flex direction="row" align="center">
              <Heading size="lg" mr="auto">{post.caption}</Heading>
              <> Like Button Temp</>
            </Flex>
            <Divider my={4} />

            {/* Comments display section */}
            <Box overflowY="scroll" maxHeight={{ sm: `260px`, md: "460px", lg: "620px" }}>
              {comments.map(comment => (
                <Box key={comment.id} mb="2">
                  <Text as="span" fontWeight="bold">{comment.user.username}: </Text>
                  <Text as="span">{comment.content}</Text>
                </Box>
              ))}
            </Box>

            {/* Comment form */}
            <Box as="form" mt="4" onSubmit={handleCommentSubmit}>
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
            </Box>
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
