import { Box } from '@chakra-ui/react';
import { NextPage } from 'next';
import Head from 'next/head';
import Navbar from "../components/Navbar";
import axios from 'axios';
import { Comment, Like, User, Post } from '../types/types';
import useUserStore from '../store/userStore';
import { useEffect, useState } from 'react';

const Home: NextPage = () => {
  const { user, setUser } = useUserStore();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Replace the URL with api endpoint later
        const res = await axios.get('http://localhost:3001/users/me', {
          withCredentials: true // Ensure credentials are sent with the request
        });
        setUser(res.data.user);
      } catch (error) {
        console.error("Error fetching user", error);
        setUser(null);
      }
    };

    fetchUser();
  }, []);

  return (
    <Box minH="100vh" position="relative">
      <Head>
        <title>Palette</title>
      </Head>
      <Navbar />
      <Box>
        {/* photos stub */}
        <Box>
          photos stub
        </Box>
      </Box>
    </Box>
  );
};

export default Home;
