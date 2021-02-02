// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

import getBinancePrice from "../../binance-calculations";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { method, query } = req;

  const price = await getBinancePrice({ bitcoinAmount: 1, retry: 1 });

  res.status(200);
  res.json(price);
  res.end();
};
