import { SET_GLOBAL_FINANCIAL_STATE, SET_GLOBAL_SETUP_STATE } from "./types";

export const setGlobalFinancialState = (finance) => ({
  type: SET_GLOBAL_FINANCIAL_STATE,
  payload: finance,
});

export const setGlobalSetupState = (setup) => ({
  type: SET_GLOBAL_SETUP_STATE,
  payload: setup,
});
