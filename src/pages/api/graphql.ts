import { ApolloServer } from "apollo-server-micro"

import { typeDefs } from "src/graphql/schema"
import { fetchMarkets, getMarketData } from "src/lib/marketData"

const resolvers = {
  Query: {
    bestMarket: async (_parent, { btcAmount }) => {
      const marketList = await fetchMarkets(btcAmount)
      return getMarketData({ btcAmount, marketList })
    },
  },
}

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
})

export const config = {
  api: {
    bodyParser: false,
  },
}

export default apolloServer.createHandler({ path: "/api/graphql" })
