import { Box, Flex, Button, Text } from '@chakra-ui/react'
import { useRouter } from "next/router";


const Navbar = () => {

  const router = useRouter();

  let desc: string = "";

  if (router.pathname.includes("upload")) {
    desc = "Upload a photo";
  } else if (router.pathname.includes("photos")) {
    desc = "Your photos";
  } else if (router.pathname.includes("liked")) {
    desc = "Liked photos";
  }




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
        {/* <Box ml="auto">
          {me ? (
            <Menu>
              <MenuButton>
                <Image
                  borderRadius="full"
                  boxSize="40px"
                  src={user.avatar}
                  _hover={{ border: "black 2px solid" }}
                  alt="avatar"
                  onClick={() => {
                    router;
                  }}
                />
              </MenuButton>

              <MenuList>
                <MenuItem
                  onClick={() => {
                    router.push("/u/create-photo");
                  }}
                >
                  Create photo
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    router.push("/u/your-photos");
                  }}
                >
                  Your photos
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    router.push("/u/hearted-photos");
                  }}
                >
                  Hearted photos
                </MenuItem>
                <MenuItem
                  onClick={async () => {
                    await logout();

                    if (
                      router.pathname === "/u/create-photo" ||
                      router.pathname === "/u/your-photos" ||
                      router.pathname === "/u/hearted-photos"
                    ) {
                      await router.push("/");
                    } else if (router.pathname === "/") {
                      setMe(null);
                    } else {
                      setUser(null);
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
        </Box> */}
      </Flex>
    </Box>
  );
}

export default Navbar;