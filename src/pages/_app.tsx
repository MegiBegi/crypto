import { ChakraProvider, ColorModeScript } from "@chakra-ui/react"
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client"
import theme from "public/theme"

function MyApp({ Component, pageProps }) {
  const client = new ApolloClient({
    uri: "/api/graphql",
    cache: new InMemoryCache(),
  })

  return (
    <ApolloProvider client={client}>
      <ChakraProvider>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />

        <Component {...pageProps} />
      </ChakraProvider>
    </ApolloProvider>
  )
}

export default MyApp
