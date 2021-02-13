import { getOrderBookValues } from "../helpers";

type SingularRecordPrice = string;
type SingularRecordAmount = string;

type Resources = {
  bids: [SingularRecordPrice, SingularRecordAmount][];
  asks: [SingularRecordPrice, SingularRecordAmount][];
};
const bids: Resources["bids"] = [
  ["100", "0.3"],
  ["101", "0.3"],
  ["102", "0.3"],
  ["103", "0.3"],
  ["104", "0.3"],
  ["105", "0.3"],
];

describe("getOrderBookValues", () => {
  it("Checks USD value for BTC0.3", () => {
    const [USDAsksAmount, btcAsksSum] = getOrderBookValues({
      recordList: bids,
      btcAmount: 0.3,
    });

    expect(USDAsksAmount).toEqual(30);
    expect(btcAsksSum).toEqual(0.3);
  });

  it("Checks USD value for BTC0.9", () => {
    const [USDAsksAmount, btcAsksSum] = getOrderBookValues({
      recordList: bids,
      btcAmount: 0.9,
    });

    expect(USDAsksAmount).toEqual(90.9);
    expect(btcAsksSum).toEqual(0.9);
  });

  it("Checks USD value for BTC1", () => {
    const [USDAsksAmount, btcAsksSum] = getOrderBookValues({
      recordList: bids,
      btcAmount: 1,
    });

    expect(USDAsksAmount).toEqual(101.2);
    expect(btcAsksSum).toEqual(1);
  });

  it("Checks USD value for BTC2", () => {
    const [USDAsksAmount, btcAsksSum] = getOrderBookValues({
      recordList: bids,
      btcAmount: 2,
    });

    expect(USDAsksAmount).toEqual(184.49999999999997);
    expect(btcAsksSum).toEqual(1.8);
  });
});
