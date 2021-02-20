import {
  ChakraProvider,
  ColorModeScript,
  extendTheme,
  ColorMode,
} from "@chakra-ui/react";
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";

function MyApp({ Component, pageProps }) {
  const client = new ApolloClient({
    uri: "/api/graphql",
    cache: new InMemoryCache(),
  });

  const config = {
    initialColorMode: "light" as ColorMode,
    useSystemColorMode: false,
  };
  const theme = extendTheme({ config });

  return (
    <ApolloProvider client={client}>
      <ChakraProvider>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />

        <Component {...pageProps} />
      </ChakraProvider>
    </ApolloProvider>
  );
}

export default MyApp;
