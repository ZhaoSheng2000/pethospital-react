import {combineReducers} from 'redux'

import {
    LOGIN_SUCCESS,
    ERR_MSG,
} from "./action-types";
const defaultUser = {
    user: '',
}

//产生user状态的reducer
function user(state = defaultUser, action) {
    switch (action.type) {
        case LOGIN_SUCCESS:
            return {...state, user: action.data.data};
        case ERR_MSG:
            return {...state, message: action.data};
        default:
            return state
    }
}


export default combineReducers({
    user,
})
