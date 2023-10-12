import { GetServerSideProps, NextPage } from 'next';
import axios from 'axios';
import Head from 'next/head';
import { useState, useEffect } from 'react';
import { Post, User } from '../../types/types';
import { Box, Flex, Grid, Text } from "@chakra-ui/react";
import Navbar from "../../components/Navbar";
import Photo from "../../components/Photo";
import { useRouter } from 'next/router';
import { useInView } from 'react-intersection-observer';

interface UserPostsProps {
  initialUser: User | null;
  initialData: {
    username: string;
    posts: Post[];
  };
}

const UserPosts: NextPage<UserPostsProps> = ({ initialUser, initialData }) => {
  const router = useRouter();

  const [posts, setPosts] = useState<Post[]>(initialData.posts || []);
  const [page, setPage] = useState<number>(2);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [username, setUsername] = useState<string>(initialData.username);

  const { ref, inView } = useInView({
    threshold: 0.1
  });

  useEffect(() => {
    if (inView && hasMore) {
      const fetchPosts = async () => {
        try {
          const res = await axios.get(`http://localhost:3001/posts/user/${router.query.user}?skip=${(page - 1) * 9}&limit=9`);
          if (res.data.posts.length > 0) {
            setPosts(prevPosts => [...prevPosts, ...res.data.posts]);
            setPage(prevPage => prevPage + 1);
            if (res.data.posts.length < 9) {
              setHasMore(false);
            }
          } else {
            setHasMore(false);
          }
        } catch (error) {
          console.error("Error fetching posts", error);
        }
      };
      fetchPosts();
    }
  }, [inView]);

  return (
    <Box minH="100vh" position="relative">
      <Head>
        <title>Palette</title>
      </Head>
      <Navbar user={initialUser} />

      <Flex flexDirection="column" alignItems="center" mt={5}>
        <Text fontSize="xl" fontWeight="bold" mb={4}>
          {username ? `Posts by ${username}` : 'Loading...'}
        </Text>
        {posts.length > 0 ? (
          <Grid templateColumns={['1fr', '1fr 1fr', '1fr 1fr 1fr']} gap={20}>
            {posts.map(post => (
              <Photo photo={post} key={post.id} />
            ))}
          </Grid>
        ) : (
          username && <Text mt={5}>No posts</Text>
        )}
        <Box ref={ref}>
          {hasMore && <p>Loading more posts...</p>}
        </Box>
      </Flex>
    </Box>
  );
};

export default UserPosts;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const cookie = context.req.headers.cookie;
  const userId = context.query.user as string;

  let user = null;
  try {
    const userRes = await axios.get('http://localhost:3001/users/me', {
      headers: {
        cookie: cookie,
      },
    });
    user = userRes.data.user;
  } catch (error) {
    console.error("Error fetching user details", error);
  }

  const postsRes = await axios.get(`http://localhost:3001/posts/user/${userId}?skip=0&limit=9`);

  return {
    props: {
      initialUser: user,
      initialData: postsRes.data,
    },
  };
};
