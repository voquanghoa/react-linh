import {
    GET_BOOKS_REQUEST,
    GET_BOOKS_SUCCESS,
} from "./../actions/bookActions";

export default function bookReducer(state = {}, action = {}) {
    switch(action.type) {
        case GET_BOOKS_REQUEST: {
            return state;
        }
        case GET_BOOKS_SUCCESS: {
            return action.data;
        }
        default:
            return state;
    }
}