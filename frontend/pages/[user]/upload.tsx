import React from 'react';
import { useRouter } from 'next/router';
import Navbar from '../../components/Navbar';
import { Box, Input, Heading, Flex, Text, Button } from '@chakra-ui/react';
import Head from 'next/head';
import useCurrentUser from '../../hooks/useCurrentUser';
import { useEffect, useState } from 'react'
import axios from 'axios'
import { GetServerSideProps } from 'next';
import { User } from '../../types/types'

interface UploadPageProps {
  user: User;
}

const UploadPage: React.FC<UploadPageProps> = ({ user }) => {
  // const { user, setUser, loadingUser } = useCurrentUser();
  const [caption, setCaption] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  console.log(user)

  const router = useRouter();

  // useEffect(() => {
  //   if (!loadingUser && !user) {
  //     router.push('/'); // or wherever you want to redirect unauthenticated users
  //   }
  // }, [loadingUser, user]);



  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !user) return;

    setLoading(true);

    try {
      // Step 1: Get a presigned URL from the backend
      const { data } = await axios.get(`http://localhost:3001/posts/url`, {
        params: {
          fileName: file.name,
          fileType: file.type
        }
      });
      const { presignedURL, url } = data;

      // Step 2: Use the presigned URL to upload the image
      await axios.put(presignedURL, file, {
        headers: {
          'Content-Type': file.type,
        },
      });

      // Step 3: Send the image URL along with the caption to the backend
      const response = await axios.post('http://localhost:3001/posts', {
        userId: user.id,
        imageUrl: url,
        caption
      });

      // ... handle success, perhaps redirect to the post or a success message

      console.log("Successfully uploaded")

    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setLoading(false);
    }
  };


  return (
    <Flex direction="column" align="center" justify="center">
      <Head>
        <title>Upload Photo</title>
      </Head>
      <Navbar user={user} />
      <Flex maxW="500px" px={5} py={5} direction="column" >
        <Heading mb={6}>Upload a photo</Heading>
        <form onSubmit={handleSubmit}>
          <Flex direction="column">
            <Text mb={2}>Caption</Text>
            <Input
              placeholder="caption"
              mb={5}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />
            <input
              required
              name="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
            <Button
              mt={6}
              type="submit"
              colorScheme="teal"
              isLoading={loading}
              loadingText="uploading..."
            >
              Submit
            </Button>
          </Flex>
        </form>
      </Flex>
    </Flex>

  );
};

export default UploadPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const cookie = context.req.headers.cookie; // If using cookies
  try {
    const res = await axios.get('http://localhost:3001/users/me', {
      headers: {
        cookie: cookie,
      },
    });

    if (res.data.user) {
      return {
        props: {
          user: res.data.user,
        },
      };
    } else {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      };
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }
};
