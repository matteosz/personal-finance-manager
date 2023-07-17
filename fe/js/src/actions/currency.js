import { SET_CURRENCY } from "./types";

export const setCurrency = (currency) => ({
  type: SET_CURRENCY,
  payload: currency,
});
