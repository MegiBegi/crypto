import React, { FC, useState, useEffect } from "react";
import Head from "next/head";
import { GetStaticProps } from "next";
import debounce from "lodash.debounce";
import { TimeIcon } from "@chakra-ui/icons";
import { useQuery } from "react-query";

import { getPriceDeltas, getMarketData } from "../lib/helpers";
import { Results } from "../lib/types";
import PrettyError from "../lib/PrettyError";
import {
  NumberInput,
  NumberInputField,
  Stat,
  StatNumber,
  StatLabel,
  StatHelpText,
  StatArrow,
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

/**
 * SAMPLES
 * USDAmount: 149433.50352462003
 * btcAmount: 4
 * marketName: "Binance"
 */

type SSG = { marketData: Results };

const Binance: FC<SSG> = (props) => {
  const [btcAmount, setBTCAmount] = useState<number>(
    props.marketData.btcAmount
  );
  const [{ askPriceDelta, bidPriceDelta }, setPriceDelta] = useState<{
    askPriceDelta: string | null;
    bidPriceDelta: string | null;
  }>({
    askPriceDelta: null,
    bidPriceDelta: null,
  });

  const { isLoading, error, data, isFetching } = useQuery<Results>(
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
        <StatHelpText>Feb 12 - Feb 28</StatHelpText>
      </Stat>

      <Heading as="h2" size="l" mt="4">
        The best market to buy is atm
      </Heading>
      <Heading as="h2" size="xl" mb="4">
        {isLoading ? <Spinner size="xs" /> : marketData.asksBestMarketName}
      </Heading>
      <Stat>
        <StatLabel>USD</StatLabel>
        <StatNumber>
          {isLoading ? (
            <Spinner size="xs" />
          ) : typeof marketData.asksBestUSDAmount === "string" ? (
            marketData.asksBestUSDAmount
          ) : (
            `$ ${marketData.asksBestUSDAmount.toLocaleString()}`
          )}
        </StatNumber>
        {Number(askPriceDelta) !== 0 && (
          <StatHelpText>
            <StatArrow
              type={Number(askPriceDelta) > 0 ? "increase" : "decrease"}
            />
            {askPriceDelta?.toLocaleString()}%
          </StatHelpText>
        )}
      </Stat>

      <Heading as="h2" size="l" mt="4">
        The best market to sell is atm
      </Heading>
      <Heading as="h2" size="xl" mb="4">
        {isLoading ? <Spinner size="xs" /> : marketData.bidsBestMarketName}
      </Heading>
      <Stat>
        <StatLabel>USD</StatLabel>
        <StatNumber>
          {isLoading ? (
            <Spinner size="xs" />
          ) : typeof marketData.bidsBestUSDAmount === "string" ? (
            marketData.bidsBestUSDAmount
          ) : (
            `$ ${marketData.bidsBestUSDAmount.toLocaleString()}`
          )}
        </StatNumber>
        {Number(bidPriceDelta) !== 0 && (
          <StatHelpText>
            <StatArrow
              type={Number(bidPriceDelta) > 0 ? "increase" : "decrease"}
            />
            {bidPriceDelta?.toLocaleString()}%
          </StatHelpText>
        )}
      </Stat>

      <h4>
        {isLoading ? (
          <Spinner size="xs" />
        ) : (
          marketData.errors?.map((error) => (
            <div>
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
  const marketData = await getMarketData({ btcAmount });

  return {
    props: { marketData },
    revalidate: 5,
  };
};

export default Binance;
