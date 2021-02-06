// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

import getBinancePrice from "../../lib/binance-calculations";
import getCoinbasePrice from "../../lib/coinbase-calculations";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const binanceData = await getBinancePrice({
    bitcoinAmount: Number(req.query.amount),
  });

  const coinbaseData = await getCoinbasePrice({
    bitcoinAmount: Number(req.query.amount),
  });

  const market =
    binanceData.USDAmount > coinbaseData.USDAmount ? coinbaseData : binanceData;

  res.status(200);
  res.json(market);
  res.end();
};
