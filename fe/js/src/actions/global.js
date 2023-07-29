import { SET_GLOBAL_SETUP_STATE, SET_GLOBAL_NETWORTH_STATE } from "./types";

export const setGlobalSetupState = (setup) => ({
  type: SET_GLOBAL_SETUP_STATE,
  payload: setup,
});

export const setGlobalNetWorthState = (netWorth) => ({
  type: SET_GLOBAL_NETWORTH_STATE,
  payload: netWorth,
});
