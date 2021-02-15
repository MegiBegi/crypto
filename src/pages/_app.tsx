import { ChakraProvider, Box } from "@chakra-ui/react";
import { ReactQueryDevtools } from "react-query/devtools";

import { QueryClient, QueryClientProvider } from "react-query";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";

function MyApp({ Component, pageProps }) {
  const queryClient = new QueryClient();

  const client = new ApolloClient({
    uri: pageProps.graphqlEndpoint,
    cache: new InMemoryCache(),
  });

  return (
    <ApolloProvider client={client}>
      <QueryClientProvider client={queryClient}>
        <ChakraProvider>
          <Box
            w="100%"
            minH="100vh"
            d="flex"
            justifyContent="center"
            bgGradient={[
              "linear(to-tr, teal.300,yellow.400)",
              "linear(to-t, blue.200, teal.500)",
              "linear(to-b, orange.100, purple.300)",
            ]}
          >
            <Component {...pageProps} />
          </Box>
        </ChakraProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ApolloProvider>
  );
}

// Only uncomment this method if you have blocking data requirements for
// every single page in your application. This disables the ability to
// perform automatic static optimization, causing every page in your app to
// be server-side rendered.
//
// MyApp.getInitialProps = async (appContext) => {
//   // calls page's `getInitialProps` and fills `appProps.pageProps`
//   const appProps = await App.getInitialProps(appContext);
//
//   return { ...appProps }
// }

export default MyApp;
