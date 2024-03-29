import React, { FC, useState } from "react"
import { GetStaticProps } from "next"
import debounce from "lodash.debounce"
import {
  Box,
  useColorMode,
  IconButton,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  InputLeftElement,
  InputGroup,
} from "@chakra-ui/react"
import { SunIcon, MoonIcon } from "@chakra-ui/icons"

import { getMarketData, fetchMarkets } from "src/lib/marketData"
import BestMarketContent from "src/lib/components/BestMarketContent"
import { useConstant } from "src/lib/hooks"
import { BestMarket, useMarketDataQuery } from "src/generated/graphql"

type SSG = { marketData: BestMarket }

const BestMarketData: FC<SSG> = props => {
  const [btcAmount, setBTCAmount] = useState<number>(props.marketData.btcAmount)
  const { colorMode, toggleColorMode } = useColorMode()

  const {
    error,
    loading,
    data = { bestMarket: props.marketData },
  } = useMarketDataQuery({
    variables: { btcAmount },
    pollInterval: btcAmount > 5 ? 3000 : 1000,
    // Hack for a reported bug https://github.com/apollographql/apollo-client/issues/5531
    notifyOnNetworkStatusChange: true,
  })

  const debouncedBTCAmount = useConstant(() =>
    debounce((val: number) => {
      setBTCAmount(val)
    }, 250)
  )

  if (error) return <h1>{`An error has occurred: ${error}`}</h1>

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

      <BestMarketContent marketData={data?.bestMarket} isLoading={loading}>
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
            onChange={value => {
              debouncedBTCAmount(Number(value))
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
  )
}

export const getStaticProps: GetStaticProps<SSG> = async context => {
  const btcAmount = 2
  const marketList = await fetchMarkets(btcAmount)
  const marketData = getMarketData({ btcAmount, marketList })

  if (!marketData) throw new Error("No data available atm")

  return {
    props: { marketData },
    revalidate: 5,
  }
}

export default BestMarketData
