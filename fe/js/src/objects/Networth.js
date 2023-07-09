import { convertCurrency } from "./Currency";

export const NetWorth = (props) => {
    return { value: convertCurrency(props.rates, props.value, props.currency, "EUR"), startDate: props.date};
};