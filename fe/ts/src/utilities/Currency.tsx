import dotenv from 'dotenv';

dotenv.config();

const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000; // 1 day in milliseconds
const CURRENCIES = {
    USD: "$",
    EUR: "€",
    CHF: ".-",
};

let exchangeRates: any = null; // In-memory storage for exchange rates data

const checkRatesExist = (): boolean => {
    return localStorage.getItem("exchangeRates") !== null;
};

const readJson = (): JSON => {
    return JSON.parse(localStorage.getItem("exchangeRates") as string);
};

const saveRates = async (data: any) => {
    localStorage.setItem("exchangeRates", JSON.stringify(data));
};

const fetchExchangeRates = async () => {
    const appID = process.env.EXCHANGE_RATES_ID; // Fetch the app ID from environment variables
    console.log(appID);
    const apiURL = `https://openexchangerates.org/api/latest.json?app_id=${appID}&base=EUR`;

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
            return;
        }
    }

    // Fetch the exchange rates using the API
    exchangeRates = await fetchExchangeRates();

    // Save the rates to the file, replacing the old one if present
    await saveRates(exchangeRates);

    return;
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

export default exchangeRates;