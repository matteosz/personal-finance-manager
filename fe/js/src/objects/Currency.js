import { CURRENCIES } from "../common/constants";

export const convertCurrency = (
  exchangeRates,
  amount,
  from,
  to,
  lastDate = false
) => {
  if (from === to) {
    return amount;
  }

  if (lastDate) {
    const dates = Object.keys(exchangeRates);
    dates.sort((a, b) => b.localeCompare(a));
    exchangeRates = exchangeRates[dates[0]];
  }

  // Check if the rates are loaded
  if (exchangeRates === null) {
    throw new Error("Exchange rates not loaded");
  }

  // Convert the amount
  const fromRate = exchangeRates[from];
  const toRate = exchangeRates[to];

  return (amount / fromRate) * toRate;
};

export const Currency = (props) => {
  const { value, code } = props;
  const currencySymbol = CURRENCIES[code];
  return (
    <span>
      {value.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,")}
      {currencySymbol}
    </span>
  );
};
