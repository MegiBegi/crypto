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

export type Query = {
  __typename?: 'Query';
  bestMarket?: Maybe<BestMarket>;
};


export type QueryBestMarketArgs = {
  btcAmount: Scalars['Float'];
};

export enum CacheControlScope {
  Public = 'PUBLIC',
  Private = 'PRIVATE'
}

