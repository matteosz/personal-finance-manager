import {
  CLEAR_USER,
  SET_USER_CONTENT,
  ADD_USER_EXPENSE,
  ADD_USER_INCOME,
  ADD_USER_ASSET,
  MODIFY_USER_EXPENSE,
  MODIFY_USER_INCOME,
  MODIFY_USER_ASSET,
  SET_USER_WALLET,
} from "../actions/types";

const initialState = {};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER_CONTENT:
      return {
        ...state,
        user: action.payload,
      };
    case SET_USER_WALLET:
      return {
        ...state,
        user: {
          ...state.user,
          wallet: action.payload,
        },
      };
    case ADD_USER_EXPENSE:
      return {
        ...state,
        user: {
          ...state.user,
          expenses: [...state.user.expenses, action.payload.expense],
          wallet: action.payload.wallet,
        },
      };
    case MODIFY_USER_EXPENSE:
      return {
        ...state,
        user: {
          ...state.user,
          expenses: state.user.expenses
            .map((expense) => {
              const expenseData = action.payload.expense;
              if (expense.id === expenseData.id) {
                if (expenseData.toBeDeleted) {
                  return null;
                } else {
                  return expenseData; // Replace the item with the new expense
                }
              }
              return expense; // Keep the original expense item
            })
            .filter(Boolean), // Remove any null values from the expenses list
          wallet: action.payload.wallet,
        },
      };

    case MODIFY_USER_INCOME:
      return {
        ...state,
        user: {
          ...state.user,
          income: state.user.income
            .map((income) => {
              const incomeData = action.payload.income;
              if (income.id === incomeData.id) {
                if (incomeData.toBeDeleted) {
                  return null;
                } else {
                  return incomeData;
                }
              }
              return income;
            })
            .filter(Boolean),
        },
        wallet: action.payload.wallet,
      };
    case ADD_USER_INCOME:
      return {
        ...state,
        user: {
          ...state.user,
          income: [...state.user.income, action.payload.income],
          wallet: action.payload.wallet,
        },
      };
    case ADD_USER_ASSET:
      return {
        ...state,
        user: {
          ...state.user,
          assets: [...state.user.assets, action.payload.asset],
          wallet: action.payload.wallet,
        },
      };
    case MODIFY_USER_ASSET:
      return {
        ...state,
        user: {
          ...state.user,
          assets: state.user.assets
            .map((asset) => {
              const assetData = action.payload.asset;
              if (asset.id === assetData.id) {
                if (assetData.toBeDeleted) {
                  return null;
                } else {
                  return assetData;
                }
              }
              return asset;
            })
            .filter(Boolean),
          wallet: action.payload.wallet,
        },
      };
    case CLEAR_USER:
      return {
        ...state,
        user: null,
      };
    default:
      return state;
  }
};

export default userReducer;
