const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000; // 1 day in milliseconds
const CURRENCIES = {
    USD: "$",
    EUR: "€",
    CHF: ".-",
};

let exchangeRates: any = null; // In-memory storage for exchange rates data

const checkRatesExist = (): boolean => {
    return sessionStorage.getItem("exchangeRates") !== null;
};

const readJson = (): JSON => {
    return JSON.parse(sessionStorage.getItem("exchangeRates") as string);
};

const saveRates = async (data: any) => {
    sessionStorage.setItem("exchangeRates", JSON.stringify(data));
};

const fetchExchangeRates = async () => {
    const appID: string = (process.env.REACT_APP_EXCHANGE_RATES_ID as string); // Fetch the app ID from environment variables
    console.log(appID);
    const apiURL = `https://openexchangerates.org/api/latest.json?app_id=${appID}`;

    // Perform the API call and fetch the data
    const response = await fetch(apiURL);
    const data = await response.json();

    return data;
};

export const checkExchangeRates = async () => {
    // Check if the exchange rates file exists
    if (checkRatesExist()) {
        exchangeRates = readJson();
        // Read the file timestamp
        const timestamp = exchangeRates.timestamp;
    
        // Check if the file is recent (within the last day)
        if (Date.now() - timestamp < ONE_DAY_IN_MS) {
            // File is recent, no need to request new rates
            console.log("Exchange rates are recent");
            return;
        }
    }

    console.log("Fetching exchange rates...");

    // Fetch the exchange rates using the API
    exchangeRates = await fetchExchangeRates();

    // Save the rates to the file, replacing the old one if present
    await saveRates(exchangeRates);

    return;
};

export const convertCurrency = (amount: number, from: string, to: string): number => {
    // Check if the rates are loaded
    if (exchangeRates === null) {
        throw new Error("Exchange rates not loaded");
    }

    // Convert the amount
    const fromRate = exchangeRates.rates[from];
    const toRate = exchangeRates.rates[to];

    return (amount / fromRate) * toRate;
};

export const Currency = (props: { value: number; code: string }) => {
    const { value, code } = props;
    const currencySymbol = CURRENCIES[code as keyof typeof CURRENCIES];

    return (
        <span>
            {value.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,")}{currencySymbol}
        </span>
    );
};