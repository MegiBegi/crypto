import { ApolloClient, InMemoryCache } from "@apollo/client";

function getGqlClient() {
  return new ApolloClient({
    uri: "/api/graphql",
    cache: new InMemoryCache(),
  });
}

export default getGqlClient;
