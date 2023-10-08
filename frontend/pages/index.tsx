import { NextPage } from 'next';
import Head from 'next/head';
import Navbar from "../components/Navbar";
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Post } from '../types/types';
import useUserStore from '../store/userStore';
import { Box, Image } from "@chakra-ui/react";
import { useInView } from 'react-intersection-observer';

const Home: NextPage = () => {

  const { user, setUser } = useUserStore();

  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const { ref, inView, entry } = useInView({
    threshold: 0.1
  });

  useEffect(() => {

    const fetchUser = async () => {
      try {
        const res = await axios.get('http://localhost:3001/users/me', {
          withCredentials: true
        });
        setUser(res.data.user);
      } catch (error) {
        console.error("Error fetching user", error);
        setUser(null);
      }
    };
    fetchUser();

  }, []);

  useEffect(() => {
    if (inView && hasMore) {
      const fetchPosts = async () => {
        try {
          const res = await axios.get(`http://localhost:3001/posts?skip=${(page - 1) * 9}&limit=9`);
          if (res.data.length > 0) {
            setPosts(prevPosts => [...prevPosts, ...res.data]);
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
  }, [inView]);

  return (
    <Box minH="100vh" position="relative">
      <Head>
        <title>Palette</title>
      </Head>
      <Navbar />
      <Box>
        {posts.map(post => (
          <Box key={post.id} marginBottom="20px">
            <Image src={post.imageUrl} alt={post.caption || 'Post image'} />
          </Box>
        ))}
        <div ref={ref}>
          {hasMore && <p>Loading more posts...</p>}
        </div>
      </Box>
    </Box>
  );
};

export default Home;
