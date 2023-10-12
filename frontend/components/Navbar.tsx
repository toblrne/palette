import { Box, Flex, Button, Text, Menu, MenuButton, MenuItem, MenuList, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, ModalCloseButton, Input, useDisclosure, useToast } from '@chakra-ui/react'
import { useRouter } from "next/router";
import { User } from '../types/types';
import { Dispatch, SetStateAction, useState } from 'react'
import axios from 'axios'

interface NavbarProps {
  user: User | null;
  // setUser?: Dispatch<SetStateAction<User | null>>
}

const Navbar = ({ user }: NavbarProps) => {

  const router = useRouter();

  const [me, setMe] = useState(user)

  console.log(me)

  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [email, setEmail] = useState("");

  let desc: string = "";

  if (router.pathname.includes("upload")) {
    desc = "Upload a photo";
  } else if (router.pathname.includes("photos")) {
    desc = "Your photos";
  } else if (router.pathname.includes("liked")) {
    desc = "Liked photos";
  }

  const handleUpload = () => {
    if (user?.id) {
      router.push(`/${user.id}/upload`);
    } else {
      toast({
        title: "Not Logged In",
        description: `Please log in!`,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  }


  const login = async () => {
    try {
      const response = await axios.post('http://localhost:3001/users/login', { email });
      toast({
        title: "Emailed",
        description: `A link has been sent to ${email}`,
        status: "success",
        duration: 9000,
        isClosable: true,
      });
      onClose();
      setEmail("");
    } catch (error) {
      console.error("Error during login", error);
      toast({
        title: "Login Failed",
        description: "An error occurred while logging in.",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  return (
    <Box w="full" h={16} top={0}>
      <Flex px={4} py={2} alignItems="center">
        <Text
          as={Button}
          onClick={() => {
            router.push("/");
          }}
          fontSize="x-large"
        >
          Palette
        </Text>
        <Box ml="auto">
          {me ? (
            <Menu>
              <MenuButton as={Button}>
                {user?.username}
              </MenuButton>

              <MenuList>
                <MenuItem
                  onClick={handleUpload}
                >
                  Upload Photo
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    router.push(`/${user?.id}/photos`);
                  }}
                >
                  Your Photos
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    router.push(`/${user?.id}/liked`);
                  }}
                >
                  Liked Photos
                </MenuItem>
                <MenuItem
                  onClick={async () => {
                    try {
                      await axios.post('http://localhost:3001/users/logout', null, {
                        withCredentials: true,
                      }); // Adjusted the URL to match your logout endpoint

                      // Redirect or update state as needed after successful logout
                      if (
                        router.pathname === "/u/create-photo" ||
                        router.pathname === "/u/your-photos" ||
                        router.pathname === "/u/hearted-photos"
                      ) {
                        await router.push("/");
                      } else {
                        setMe(null)
                      }
                    } catch (error) {
                      console.error('Logout failed', error);
                    }
                  }}
                >
                  Sign out
                </MenuItem>

              </MenuList>
            </Menu>
          ) : (
            <Button onClick={onOpen} colorScheme="teal">
              Sign in
            </Button>
          )}
        </Box>
        <Modal isOpen={isOpen} onClose={onClose} size="lg">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Sign into Palette</ModalHeader>
            <ModalCloseButton />
            <ModalBody display="flex" flexDirection="column">
              <Input
                placeholder="your-email@example.com"
                size="lg"
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" w="full" onClick={login}>
                Continue
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Flex>
    </Box>
  );
}

export default Navbar;