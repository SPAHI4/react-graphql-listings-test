import { Container } from '@chakra-ui/react';
import React from 'react';

interface Props {
  children: React.ReactNode;
}

export function Layout({ children }: Props) {
  return (
    <Container maxW="container.xl" py={8}>
      {children}
    </Container>
  );
}
