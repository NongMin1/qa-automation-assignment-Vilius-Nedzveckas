export interface BuyCryptoData {
  fiat: string;
  crypto: string;
  amounts: {
    valid: string;
    min: string;
    max: string;
    invalid: string;
  };
  invalidAddress: string;
}

export const BUY_CRYPTO_DATA: BuyCryptoData = {
  fiat: "EUR",
  crypto: "BTC",
  amounts: {
    valid: "200",
    min: "1",
    max: "200000",
    invalid: "abc",
  },
  invalidAddress: "asd",
};
