import React, { FC, useState } from "react";
import { GetStaticProps } from "next";
import debounce from "lodash.debounce";
import { gql, useQuery } from "@apollo/client";
import { Box, useColorMode, IconButton } from "@chakra-ui/react";

import { getMarketData, fetchMarkets } from "../lib/marketData";
import BestMarketContent from "../lib/components/BestMarketContent";
import { SunIcon, MoonIcon } from "@chakra-ui/icons";

import {
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  InputLeftElement,
  InputGroup,
} from "@chakra-ui/react";
import { useConstant } from "../lib/hooks";
import { BestMarket } from "../generated/types";

type SSG = { marketData: BestMarket };

const btcMarketDataQuery = gql`
  query($btcAmount: Float!) {
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

const BestMarketData: FC<SSG> = (props) => {
  const [btcAmount, setBTCAmount] = useState<number>(
    props.marketData.btcAmount
  );
  const { colorMode, toggleColorMode } = useColorMode();

  const { loading, error, data = { bestMarket: props.marketData } } = useQuery(
    btcMarketDataQuery,
    {
      variables: { btcAmount },
      pollInterval: btcAmount > 5 ? 3000 : 1000,
    }
  );

  const debouncedBTCAmount = useConstant(() =>
    debounce((val: number) => {
      setBTCAmount(val);
    }, 250)
  );

  if (error) return <h1>{`An error has occurred: ${error}`}</h1>;

  return (
    <Box
      w="100%"
      minH="100vh"
      d="flex"
      justifyContent="center"
      backgroundImage={
        colorMode === "dark"
          ? "linear-gradient(rgb(125, 81, 3), rgb(71, 16, 165))"
          : "linear-gradient(to bottom, #FEEBC8, #B794F4)"
      }
    >
      <IconButton
        variant="outline"
        colorScheme="teal"
        aria-label="Send email"
        icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
        onClick={toggleColorMode}
        position="absolute"
        top="20px"
        right="20px"
        _hover={{ background: "none" }}
      />

      <BestMarketContent isLoading={loading} marketData={data?.bestMarket}>
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
      </BestMarketContent>
    </Box>
  );
};

export const getStaticProps: GetStaticProps<SSG> = async (context) => {
  const btcAmount = 2;
  const marketList = await fetchMarkets(btcAmount);
  const marketData = getMarketData({ btcAmount, marketList });

  if (!marketData) throw new Error("No data available atm");

  return {
    props: { marketData },
    revalidate: 5,
  };
};

export default BestMarketData;
