import { ChakraProvider, extendTheme, Box } from "@chakra-ui/react";

function MyApp({ Component, pageProps }) {
  const colors = {
    brand: {
      900: "#1a365d",
      800: "#153e75",
      700: "#2a69ac",
    },
  };

  const theme = extendTheme({ colors });
  //    <ChakraProvider theme={theme}>

  return (
    <ChakraProvider>
      <Box
        w="100%"
        h="100vh"
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
