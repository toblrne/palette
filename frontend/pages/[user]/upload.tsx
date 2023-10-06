import React from 'react';
import { useRouter } from 'next/router';
import Navbar from '../../components/Navbar';
import { Box, Text } from '@chakra-ui/react';
import Head from 'next/head';
import useUserStore from '../../store/userStore';

const UploadPage: React.FC = () => {
  const { user, setUser } = useUserStore();

  const router = useRouter();
  const { u } = router.query; // Get the dynamic parameter from the URL

  console.log(user?.id, u)

  // Check if u matches user.id
  const isMatchingUser = u === user?.id.toString();




  return (
    <Box>
      <Head>
        <title>Upload Photo</title>
      </Head>
      <Navbar />
    </Box>

  );
};

export default UploadPage;