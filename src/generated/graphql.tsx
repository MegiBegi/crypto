import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The `Upload` scalar type represents a file upload. */
  Upload: any;
};


export type BestMarket = {
  __typename?: 'BestMarket';
  btcAmount: Scalars['Float'];
  errors?: Maybe<Array<Maybe<Scalars['String']>>>;
  bidsBestMarketName: Scalars['String'];
  asksBestMarketName: Scalars['String'];
  bidsBestUSDAmount?: Maybe<Scalars['Float']>;
  asksBestUSDAmount?: Maybe<Scalars['Float']>;
  date: Scalars['String'];
};

export type NewBook = {
  __typename?: 'NewBook';
  books: Array<Scalars['String']>;
  newies?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
};

export type Query = {
  __typename?: 'Query';
  bestMarket?: Maybe<BestMarket>;
  newBook: NewBook;
};


export type QueryBestMarketArgs = {
  btcAmount: Scalars['Float'];
};

export enum CacheControlScope {
  Public = 'PUBLIC',
  Private = 'PRIVATE'
}


export type MarketDataQueryVariables = Exact<{
  btcAmount: Scalars['Float'];
}>;


export type MarketDataQuery = (
  { __typename?: 'Query' }
  & { bestMarket?: Maybe<(
    { __typename?: 'BestMarket' }
    & Pick<BestMarket, 'btcAmount' | 'errors' | 'bidsBestMarketName' | 'asksBestMarketName' | 'bidsBestUSDAmount' | 'asksBestUSDAmount' | 'date'>
  )> }
);


export const MarketDataDocument = gql`
    query marketData($btcAmount: Float!) {
  bestMarket(btcAmount: $btcAmount) {
    btcAmount
    errors
    bidsBestMarketName
    asksBestMarketName
    bidsBestUSDAmount
    asksBestUSDAmount
    date
  }
}
    `;

/**
 * __useMarketDataQuery__
 *
 * To run a query within a React component, call `useMarketDataQuery` and pass it any options that fit your needs.
 * When your component renders, `useMarketDataQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMarketDataQuery({
 *   variables: {
 *      btcAmount: // value for 'btcAmount'
 *   },
 * });
 */
export function useMarketDataQuery(baseOptions: Apollo.QueryHookOptions<MarketDataQuery, MarketDataQueryVariables>) {
        return Apollo.useQuery<MarketDataQuery, MarketDataQueryVariables>(MarketDataDocument, baseOptions);
      }
export function useMarketDataLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MarketDataQuery, MarketDataQueryVariables>) {
          return Apollo.useLazyQuery<MarketDataQuery, MarketDataQueryVariables>(MarketDataDocument, baseOptions);
        }
export type MarketDataQueryHookResult = ReturnType<typeof useMarketDataQuery>;
export type MarketDataLazyQueryHookResult = ReturnType<typeof useMarketDataLazyQuery>;
export type MarketDataQueryResult = Apollo.QueryResult<MarketDataQuery, MarketDataQueryVariables>;