import { BestMarket } from "src/generated/graphql"

export const getOrderBookValues = ({
  recordList,
  btcAmount,
}: {
  recordList: [string, string][]
  btcAmount: number
}): [number, number] => {
  let itemIndex = 0
  let USDAmount = 0
  let btcSum = 0

  while (recordList[itemIndex] && btcSum < btcAmount) {
    const [itemPrice, itemAmount] = recordList[itemIndex]
    const askPrice = Number(itemPrice)
    const askAmount = Number(itemAmount)
    const shouldBuyWholeAskedAmount = btcSum + askAmount <= btcAmount

    if (shouldBuyWholeAskedAmount) {
      btcSum += askAmount
      USDAmount += askAmount * askPrice
    } else {
      const missingAmount = btcAmount - btcSum
      btcSum += missingAmount
      USDAmount += missingAmount * askPrice
    }

    itemIndex++
  }

  return [USDAmount, btcSum]
}

export const getPriceDeltas = ({
  marketDataPrev,
  data,
}: {
  marketDataPrev: BestMarket | undefined
  data: BestMarket
}): { askPriceDelta: string | null; bidPriceDelta: string | null } => {
  let askPriceDelta = null
  let bidPriceDelta = null

  if (!marketDataPrev || !data) return { askPriceDelta, bidPriceDelta }

  if (
    typeof marketDataPrev.asksBestUSDAmount === "number" ||
    typeof data.asksBestUSDAmount === "number"
  ) {
    const askPriceDifference =
      (data.asksBestUSDAmount as number) -
      (marketDataPrev.asksBestUSDAmount as number)
    askPriceDelta =
      (askPriceDifference * 100) / (data.asksBestUSDAmount as number)
  }

  if (
    typeof marketDataPrev.bidsBestUSDAmount === "number" ||
    typeof data.bidsBestUSDAmount === "number"
  ) {
    const bidPriceDifference =
      (data.bidsBestUSDAmount as number) -
      (marketDataPrev.bidsBestUSDAmount as number)
    bidPriceDelta =
      (bidPriceDifference * 100) / (data.bidsBestUSDAmount as number)
  }

  return {
    askPriceDelta: askPriceDelta?.toFixed(3),
    bidPriceDelta: bidPriceDelta?.toFixed(3),
  }
}
