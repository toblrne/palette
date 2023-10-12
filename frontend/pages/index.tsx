import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import Navbar from "../components/Navbar";
import Photo from "../components/Photo";
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Post, User } from '../types/types';
import { Box, Flex, Grid } from "@chakra-ui/react";
import { useInView } from 'react-intersection-observer';


interface HomeProps {
  initialPosts: Post[];
  user: User;
}

const Home: NextPage<HomeProps> = ({ initialPosts = [], user }) => {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [page, setPage] = useState<number>(2);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const { ref, inView } = useInView({
    threshold: 0.1
  });

  useEffect(() => {
    if (inView && hasMore) {
      const fetchPosts = async () => {
        try {
          const res = await axios.get(`http://localhost:3001/posts?skip=${(page - 1) * 9}&limit=9`);
          if (res.data.length > 0) {
            setPosts(prevPosts => [...prevPosts, ...res.data]);
            setPage(prevPage => prevPage + 1);
            if (res.data.length < 9) {
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
      <Navbar user={user} />
      <Flex justify="center" alignItems="center" width="100%" mt={5}>
        <Grid templateColumns={['1fr', '1fr 1fr', '1fr 1fr 1fr']} gap={20}>
          {posts && posts.map(post => (
            <Photo photo={post} key={post.id} />
          ))}
        </Grid>
      </Flex>
      <Box ref={ref}>
        {hasMore && <p>Loading more posts...</p>}
      </Box>
    </Box >
  );
};

export default Home;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const cookie = context.req.headers.cookie;

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

  const postsRes = await axios.get(`http://localhost:3001/posts?skip=0&limit=9`);

  return {
    props: {
      user: user,
      initialPosts: postsRes.data,
    },
  };
};