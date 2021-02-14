import React, { FC, useState, useEffect } from "react";
import Head from "next/head";
import { GetStaticProps } from "next";
import debounce from "lodash.debounce";
import { TimeIcon } from "@chakra-ui/icons";
import { useQuery } from "react-query";

import { getPriceDeltas } from "../lib/helpers";
import { getMarketData, fetchMarkets } from "../lib/marketData";
import { Results, BestMarketResultsVariants } from "../lib/types";
import PrettyError from "../lib/components/PrettyError";
import {
  NumberInput,
  NumberInputField,
  Stat,
  StatNumber,
  StatLabel,
  Spinner,
  Heading,
  Box,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  InputLeftElement,
  InputGroup,
} from "@chakra-ui/react";
import { useConstant, usePrevious } from "../lib/hooks";
import BestMarketResults from "../lib/components/BestMarketResults";

type SSG = { marketData: Results };

const Binance: FC<SSG> = (props) => {
  const [{ askPriceDelta, bidPriceDelta }, setPriceDelta] = useState<{
    askPriceDelta: string | null;
    bidPriceDelta: string | null;
  }>({
    askPriceDelta: null,
    bidPriceDelta: null,
  });
  const [btcAmount, setBTCAmount] = useState<number>(
    props.marketData.btcAmount
  );

  const { isLoading, error, data } = useQuery<Results>(
    ["bestMarket", btcAmount],
    () =>
      fetch(`/api/best-market?amount=${btcAmount}`).then((res) => res.json()),
    {
      refetchInterval: Number(btcAmount) > 5 ? 5000 : 2000,
    }
  );

  const marketDataPrev = usePrevious(data);

  useEffect(() => {
    setPriceDelta(getPriceDeltas({ marketDataPrev, data }));
  }, [data]);

  const marketData = data || props.marketData;

  const debouncedBTCAmount = useConstant(() =>
    debounce((val: number) => {
      setBTCAmount(val);
    }, 250)
  );

  if (error) return <h1>{`An error has occurred: ${error}`}</h1>;

  return (
    <Box maxW="32rem" mt="32" mb="32">
      <Head>Crypto Kingdom!</Head>

      <Heading as="h2" size="2xl" mb="4">
        Compare buying offers from Binance, Coinbase and Bitbay!
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

      <InputGroup>
        <InputLeftElement
          pointerEvents="none"
          color="black.500"
          fontSize="1.2em"
          children="₿"
          top="16px"
          left="-10px"
        />
        <NumberInput
          mt="4"
          display="block"
          defaultValue={2}
          min={0}
          placeholder="Enter amount"
          w={250}
          onChange={(value) => {
            debouncedBTCAmount(Number(value));
          }}
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </InputGroup>
    </Box>
  );
};

export const getStaticProps: GetStaticProps<SSG> = async (context) => {
  const btcAmount = 2;
  const marketList = await fetchMarkets(btcAmount);
  const marketData = getMarketData({ btcAmount, marketList });

  return {
    props: { marketData },
    revalidate: 5,
  };
};

export default Binance;
