import { Box, Image } from '@chakra-ui/react'
import { Post } from '../types/types'
import Link from 'next/link';

const Photo = ({ photo }: { photo: Post }) => {
  return (
    <Link href={`/photo/${photo.id}`}>
      <Box width="400px" height="400px" marginBottom="20px">
        <Image
          src={photo.imageUrl}
          alt={photo.caption || 'Post image'}
          boxSize="100%"
          objectFit="cover"
          loading="lazy"
        />
      </Box>
    </Link>
  );
}

export default Photo;