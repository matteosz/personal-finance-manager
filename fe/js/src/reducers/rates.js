const exchangeRatesReducer = (state = {}, action) => {
switch (action.type) {
    case 'SET_RATES':
    return {
        ...state,
        rates: action.payload,
    };
    default:
    return state;
}
};

export default exchangeRatesReducer;
  