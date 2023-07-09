const userReducer = (state = {}, action) => {
    switch (action.type) {
        case 'SET_USER_CONTENT':
        return {
            ...state,
            user: action.payload,
        };
        default:
        return state;
    }
    };
    
    export default userReducer;