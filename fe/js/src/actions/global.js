import { SET_GLOBAL_FINANCIAL_STATE } from "./types";

export const setGlobalFinancialState = (finance) => ({
  type: SET_GLOBAL_FINANCIAL_STATE,
  payload: finance,
});
