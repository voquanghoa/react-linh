import {
    GET_USER_SUCCESS,
} from "./../actions/userActions";

export default function userReducer(state = {}, action = {}) {
    switch(action.type) {
        case GET_USER_SUCCESS: {
            return action.data;
        }
        default:
            return state;
    }
}