const userReducer = (state = {}, action) => {
    switch (action.type) {
        case 'SET_USER_STATE':
        return {
            ...state,
            user: action.payload,
            rates: null
        };
        case 'SET_RATES':
        return {
            ...state,
            user: null,
            rates: action.payload,
        };
        default:
        return state;
    }
    };
    
    export default userReducer;