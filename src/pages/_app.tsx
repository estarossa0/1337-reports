import { ChakraProvider } from '@chakra-ui/react';
import theme from '../theme';
import { AppProps } from 'next/app';
import ParticlesBackground from '../components/particles-background';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider resetCSS theme={theme}>
      <ParticlesBackground />
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export default MyApp;
