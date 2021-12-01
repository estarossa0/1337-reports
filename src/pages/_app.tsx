import { ChakraProvider } from "@chakra-ui/react";
import theme from "../theme";
import { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import ParticlesBackground from "../components/particles-background";
import UserModal from "../components/user-modal";
import "../styles/Submit.css";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <ChakraProvider resetCSS theme={theme}>
        <QueryClientProvider client={queryClient}>
          <ParticlesBackground />
          <UserModal />
          <Component {...pageProps} />
        </QueryClientProvider>
      </ChakraProvider>
    </SessionProvider>
  );
}

export default MyApp;
