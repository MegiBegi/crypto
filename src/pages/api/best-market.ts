// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

import getBinancePrice from "../../lib/binance-calculations";
import getCoinbasePrice from "../../lib/coinbase-calculations";
import getBitbayPrice from "../../lib/bitbay-calculations";
import { getMarketWithBestOffer, getErrors } from "../../lib/helpers";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const btcAmount = Number(req.query.amount);
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

  const market = getMarketWithBestOffer({
    marketList,
  });

  const errors = getErrors({ marketList });

  const marketData = { ...market, errors };

  res.status(200);
  res.json(marketData);
  res.end();
};
