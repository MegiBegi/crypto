// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

import getBinancePrice from "../../lib/binance-calculations";
import getCoinbasePrice from "../../lib/coinbase-calculations";
import getBitbayPrice from "../../lib/bitbay-calculations";
import { getErrors } from "../../lib/helpers";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const date = new Date().toLocaleTimeString();
  const btcAmount = Number(req.query.amount) || 0;
  const marketList = await Promise.all([
    getBinancePrice({
      btcAmount,
    }),
    getCoinbasePrice({
      btcAmount,
    }),
    getBitbayPrice({
      btcAmount,
    }),
  ]);

  const bidsOffers = marketList.filter(
    ({ btcBidsSum }) => btcBidsSum === btcAmount
  );

  const asksOffers = marketList.filter(
    ({ btcAsksSum }) => btcAsksSum === btcAmount
  );

  const sortedBidsListByUSDAmount = bidsOffers.sort(
    (a, b) => a.USDBidsAmount - b.USDBidsAmount
  );

  const sortedAsksListByUSDAmount = asksOffers.sort(
    (a, b) => a.USDAsksAmount - b.USDAsksAmount
  );

  const errors = getErrors({ marketList });

  const marketData: {
    btcAmount: number;
    errors?: string[];
    bidsBestMarketName: string;
    asksBestMarketName: string;
    bidsBestUSDAmount: number | string;
    asksBestUSDAmount: number | string;
    date: string;
  } = {
    btcAmount,
    errors,
    bidsBestMarketName:
      sortedBidsListByUSDAmount[0]?.marketName || "No results",
    asksBestMarketName:
      sortedAsksListByUSDAmount[0]?.marketName || "No results",
    bidsBestUSDAmount:
      sortedBidsListByUSDAmount[0]?.USDBidsAmount || "No results",
    asksBestUSDAmount:
      sortedAsksListByUSDAmount[0]?.USDAsksAmount || "No results",
    date,
  };

  res.status(200);
  res.json(marketData);
  res.end();
};
