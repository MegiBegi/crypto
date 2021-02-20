import React, { FC, useState, useEffect, ReactNode } from "react";
import Head from "next/head";
import { TimeIcon } from "@chakra-ui/icons";

import { getPriceDeltas } from "../helpers";
import { Results, BestMarketResultsVariants } from "../types";
import PrettyError from "../components/PrettyError";
import {
  Stat,
  StatNumber,
  StatLabel,
  Spinner,
  Heading,
  Box,
} from "@chakra-ui/react";
import { usePrevious } from "../hooks";
import BestMarketResults from "../components/BestMarketResults";

const BestMarketContent: FC<{
  isLoading: boolean;
  marketData: Results;
  children: ReactNode;
}> = ({ marketData, children, isLoading }) => {
  const [{ askPriceDelta, bidPriceDelta }, setPriceDelta] = useState<{
    askPriceDelta: string | null;
    bidPriceDelta: string | null;
  }>({
    askPriceDelta: null,
    bidPriceDelta: null,
  });

  const marketDataPrev = usePrevious(marketData);

  useEffect(() => {
    setPriceDelta(getPriceDeltas({ marketDataPrev, data: marketData }));
  }, [marketData]);

  return (
    <Box maxW="32rem" mt="32" mb="32">
      <Head>Crypto Kingdom!</Head>

      <Heading as="h2" size="2xl" mb="4">
        Compare market offers from Binance, Coinbase and Bitbay!
      </Heading>

      <Stat>
        <StatLabel>BTC</StatLabel>
        <StatNumber>
          {isLoading ? (
            <Spinner size="xs" />
          ) : (
            `₿ ${marketData.btcAmount.toLocaleString()}`
          )}
        </StatNumber>
      </Stat>

      <BestMarketResults
        variant={BestMarketResultsVariants.Buy}
        isLoading={isLoading}
        marketData={marketData}
        askPriceDelta={askPriceDelta}
        bidPriceDelta={bidPriceDelta}
      />
      <BestMarketResults
        variant={BestMarketResultsVariants.Sell}
        isLoading={isLoading}
        marketData={marketData}
        askPriceDelta={askPriceDelta}
        bidPriceDelta={bidPriceDelta}
      />

      <h4>
        {isLoading ? (
          <Spinner size="xs" />
        ) : (
          marketData.errors?.map((error, index) => (
            <div key={index}>
              <PrettyError>{error}</PrettyError>
            </div>
          ))
        )}
      </h4>

      <Heading as="h2" size="l" mt="4">
        Last updated at
      </Heading>
      <Stat>
        <StatNumber>
          {isLoading ? (
            <Spinner size="xs" />
          ) : (
            <>
              <TimeIcon w={6} h={6} mr="2" />
              {marketData.date}
            </>
          )}
        </StatNumber>
      </Stat>

      {children}
    </Box>
  );
};

export default BestMarketContent;
