import React from 'react';
import { useRouter } from 'next/router';
import Navbar from '../../components/Navbar';
import { Box, Input, Heading, Flex, Text, Button } from '@chakra-ui/react';
import Head from 'next/head';
import useUserStore from '../../store/userStore';
import { useEffect } from 'react'


const UploadPage: React.FC = () => {
  const { user, setUser } = useUserStore();

  const router = useRouter();
  // const { u } = router.query; // Get the dynamic parameter from the URL

  // console.log(user?.id, u)

  // // Check if u matches user.id
  // const isMatchingUser = u === user?.id.toString();

  // useEffect(() => {
  //   // If the user data has been fetched and it's not the correct user, redirect them
  //   if (user && !isMatchingUser) {
  //     router.push('/'); // Redirect to home page or any other page you prefer
  //   }
  // }, [user, isMatchingUser, router]);

  useEffect(() => {
    // If the user data has been fetched and it's not the correct user, redirect them
    if (!user) {
      router.push('/'); // Redirect to home page or any other page you prefer
    }
  }, [user, router]);


  return (
    <Flex direction="column" align="center" justify="center">
      <Head>
        <title>Upload Photo</title>
      </Head>
      <Navbar />
      <Flex maxW="500px" px={5} py={5} direction="column" >
        <Heading mb={6}>Upload a photo</Heading>
        <form>
          <Flex direction="column">
            <Text mb={2}>Caption</Text>
            <Input
              placeholder="caption"
              mb={5}
            // onChange={(e) => {
            //   setPhoto({ caption: e.target.value, image: photo.image });
            // }}
            />
            <input
              required
              name="image"
              type="file"
              accept="image/*"
            // onChange={(e) => {
            //   setPhoto({ caption: photo.caption, image: e.target.files[0] });
            // }}
            />
            <Button
              mt={6}
              type="submit"
              colorScheme="teal"
              // isLoading={loading}
              loadingText="uploading..."
            >
              Submit
            </Button>
          </Flex>

        </form>
      </Flex >
    </Flex>

  );
};

export default UploadPage;

//   onSubmit={async (e) => {
//     if (loading) {
//       return toast({
//         position: "top-left",
//         title: "Error",
//         description: "Quit the spam, friend",
//         status: "error",
//         duration: 9000,
//         isClosable: true,
//       });
//     }
//     const imageFile = photo.image;

//     setLoading(true);

//     e.preventDefault();

//     const {data} = await signUrl({
//       fileName: imageFile.name,
//       fileType: imageFile.type,
//     });

//     const {signedUrl, url, finalName} = data;

//     const {status} = await uploadPhoto({
//       signedUrl,
//       imageFile,
//       type: imageFile.type,
//     });

//     if (status >= 400) {
//       return toast({
//         position: "top-left",
//         title: "Upload failed",
//         description: "Please try again",
//         status: "error",
//         duration: 9000,
//         isClosable: true,
//       });
//     }

//     const {data: returned } = await resize({key: finalName });

//     //should not be possible
//     if (returned === "err") {
//       return;
//     }

//     await addPhoto({caption: photo.caption, url });

//     setLoading(false);

//     await router.push("/");
//   }}
// >
//   <Box d="flex" flexDirection="column">
//     <Text mb={2}>Caption</Text>
//     <Input
//       placeholder="caption"
//       mb={5}
//       onChange={(e) => {
//         setPhoto({caption: e.target.value, image: photo.image });
//       }}
//     />
//     <input
//       required
//       name="image"
//       type="file"
//       accept="image/*"
//       onChange={(e) => {
//         setPhoto({caption: photo.caption, image: e.target.files[0] });
//       }}
//     />
//     <Button
//       mt={6}
//       type="submit"
//       colorScheme="teal"
//       isLoading={loading}
//       loadingText="uploading..."
//     >
//       Submit
//     </Button>
//   </Box>