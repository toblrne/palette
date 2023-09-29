import { Box } from '@chakra-ui/react'
import type { NextPage } from 'next'
import Head from 'next/head'
import Navbar from "../../components/Navbar";


const Home: NextPage = () => {
  return (
    <Box minH="100vh" position="relative">
      <Head>
        Palette
      </Head>
      <Navbar />
      <Box>
        photos stub
      </Box>
    </Box>
  )
}

export default Home

