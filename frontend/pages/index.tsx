import { Box } from '@chakra-ui/react'
import type { NextPage, GetServerSideProps } from 'next'
import Head from 'next/head'
import Navbar from "../components/Navbar";
import axios from 'axios';
import { User } from '../types/user';


interface HomeProps {
  user: User;
}


const Home: NextPage<HomeProps> = ({ user }) => {

  console.log(user)
  return (
    <Box minH="100vh" position="relative">
      <Head>
        <title>Palette</title>
      </Head>
      <Navbar />
      <Box>
        {user ? (
          <div>
            <h2>{user.username}</h2>
            <p>{user.email}</p>
            {/* Display other user details here */}
          </div>
        ) : (
          <p>No User Found</p>
        )}
        <Box>
          photos stub
        </Box>
      </Box>
    </Box>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    // Replace the URL with your API endpoint
    const res = await axios.get('http://localhost:3001/users/me', {
      headers: context.req.headers,
    });

    return {
      props: {
        user: res.data.user,
      },
    };
  } catch (error) {
    console.error("Error fetching user", error);
    return {
      props: {
        user: null,
      },
    };
  }
};

export default Home;
