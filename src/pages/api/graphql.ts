import { ApolloServer } from "apollo-server-micro";
import { typeDefs } from "../../graphql/schema";

import { fetchMarkets, getMarketData } from "../../lib/marketData";

const resolvers = {
  Query: {
    bestMarket: async (_parent, { btcAmount }, _context) => {
      const marketList = await fetchMarkets(btcAmount);
      return getMarketData({ btcAmount, marketList });
    },
  },
};

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context() {
    return {};
  },
});

const handler = apolloServer.createHandler({ path: "/api/graphql" });

export const config = {
  api: {
    bodyParser: false,
  },
};

export default handler;
