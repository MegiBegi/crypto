import { ApolloServer } from "apollo-server-micro"
import { NextApiHandler } from "next"

import { typeDefs } from "src/graphql/schema"
import { fetchMarkets, getMarketData } from "src/lib/marketData"
import cors from "micro-cors"

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
  context() {
    return {}
  },
})

let apolloServerHandler: NextApiHandler

async function getApolloServerHandler() {
  if (!apolloServerHandler) {
    await apolloServer.start()

    apolloServerHandler = apolloServer.createHandler({
      path: "/api/graphql",
    })
  }

  return apolloServerHandler
}

const handler: NextApiHandler = async (req, res) => {
  const apolloServerHandler = await getApolloServerHandler()

  if (req.method === "OPTIONS") {
    res.end()
    return
  }

  return apolloServerHandler(req, res)
}

export const config = {
  api: {
    bodyParser: false,
  },
}

export default cors()(handler)
