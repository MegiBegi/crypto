import { gql } from "apollo-server-micro";

export const typeDefs = gql`
  type BestMarket {
    btcAmount: Float!
    errors: [String]
    bidsBestMarketName: String!
    asksBestMarketName: String!
    bidsBestUSDAmount: Float!
    asksBestUSDAmount: Float!
    date: String!
  }

  type NewBook {
    books: [String!]!
    newies: String
    id: ID!
  }

  type Query {
    bestMarket(btcAmount: Float!): BestMarket
    newBook: NewBook!
  }
`;
