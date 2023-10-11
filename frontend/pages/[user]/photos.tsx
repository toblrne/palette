import { NextPage } from 'next';
import axios from 'axios';
import Head from 'next/head';
import { useState, useEffect } from 'react';
import { Post } from '../../types/types';
import { Box, Flex, Grid, Heading, Text } from "@chakra-ui/react";
import Navbar from "../../components/Navbar";
import Photo from "../../components/Photo";
import useCurrentUser from '../../hooks/useCurrentUser';
import { useRouter } from 'next/router';
import { useInView } from 'react-intersection-observer';

const UserPosts: NextPage = () => {
  const router = useRouter();
  const { user: currentUser, setUser } = useCurrentUser();

  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [username, setUsername] = useState<string | null>(null);

  const { user } = router.query

  const { ref, inView } = useInView({
    threshold: 0.1
  });

  useEffect(() => {
    if (user && inView && hasMore) {
      const fetchPosts = async () => {
        try {
          const res = await axios.get(`http://localhost:3001/posts/user/${user}?skip=${(page - 1) * 9}&limit=9`);
          console.log(res)
          setUsername(res.data.username);
          if (res.data.posts.length > 0) {
            setPosts(prevPosts => [...prevPosts, ...res.data.posts]);
            setPage(prevPage => prevPage + 1);
          } else {
            setHasMore(false);
          }
        } catch (error) {
          console.error("Error fetching posts", error);
        }
      };
      fetchPosts();
    }
  }, [inView, user]);



  return (
    <Box minH="100vh" position="relative">
      <Head>
        <title>Palette</title>
      </Head>
      <Navbar user={currentUser} setUser={setUser} />

      <Flex flexDirection="column" alignItems="center" mt={5}>
        <Text fontSize="xl" fontWeight="bold" mb={4}>
          {username ? `Posts by ${username}` : 'Loading...'}
        </Text>
        {posts.length > 0 ? <Grid templateColumns={['1fr', '1fr 1fr', '1fr 1fr 1fr']} gap={20}>
          {posts.map(post => (
            <Photo photo={post} key={post.id} />
          ))}
        </Grid> :
          <Text> no posts </Text>
        }
        <Box ref={ref}>
          {hasMore && <p>Loading more posts...</p>}
        </Box>
      </Flex>
    </Box>
  );
};

export default UserPosts;
