import { ChakraProvider } from "@chakra-ui/react";
import theme from "../theme";
import { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import ParticlesBackground from "../components/particles-background";
import UserModal from "../components/user-modal";
import "../styles/Submit.css";
import { QueryClient, QueryClientProvider, Hydrate } from "react-query";
import router from "next/router";
import { fetchError } from "../lib/api-services";
import SubmitButton from "../components/submitButton";

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  queryClient.setDefaultOptions({
    queries: {
      onError: (error: fetchError) =>
        router.replace(`/error?error=${error?.message}`),
    },
  });
  return (
    <SessionProvider session={pageProps.session}>
      <ChakraProvider resetCSS theme={theme}>
        <QueryClientProvider client={queryClient}>
          <Hydrate state={pageProps.dehydratedState}>
            <ParticlesBackground />
            <UserModal />
            <SubmitButton />
            <Component {...pageProps} />
          </Hydrate>
        </QueryClientProvider>
      </ChakraProvider>
    </SessionProvider>
  );
}

export default MyApp;
