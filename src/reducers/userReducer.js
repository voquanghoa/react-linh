import {
    GET_USER_SUCCESS,
    LOGOUT_SUCCESS
} from "./../actions/userActions";

export default function userReducer(state = {}, action = {}) {
    switch(action.type) {
        case GET_USER_SUCCESS: {
            return action.data;
        }
        case LOGOUT_SUCCESS: {
            return state;
        }
        default:
            return state;
    }
}