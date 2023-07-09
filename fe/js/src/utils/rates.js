export const CURRENCIES = {
    EUR: "€",
    USD: "$",
    CHF: ".-",
    GBP: "£",
};

export const convertCurrency = (exchangeRates, amount, to) => {
    // Check if the rates are loaded
    if (exchangeRates === null) {
        throw new Error("Exchange rates not loaded");
    }

    // Convert the amount (amount is intended in EUR)
    const fromRate = exchangeRates['EUR'];
    const toRate = exchangeRates[to];

    return amount / fromRate * toRate;
};

export const Currency = (props) => {
    const { value, code } = props;
    const currencySymbol = CURRENCIES[code];
    return (
        <span>
            {value.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,")}{currencySymbol}
        </span>
    );
};