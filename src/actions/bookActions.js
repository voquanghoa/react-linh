import { callApi } from './../utils/utilsApi';
import { 
    bookApi
} from './../constants/ApiURL';

export const GET_BOOKS_REQUEST = 'GET_BOOKS_REQUEST';
export const GET_BOOKS_SUCCESS = 'GET_BOOKS_SUCCESS';
export const GET_BOOKS_FAIL = 'GET_BOOKS_FAIL';

export function getBookList(options = {}) {
    const config = {
        method: 'GET',
    }

    return callApi(
        bookApi,
        config,
        getBookRequest(),
        getBookSuccess,
        getBookFail,
        false
    )
}

function getBookRequest() {
    return {
        type: GET_BOOKS_REQUEST,
    }
}

function getBookSuccess(data) {
    return {
        type: GET_BOOKS_SUCCESS,
        data,
    }
}

function getBookFail(error) {
    return {
        type: GET_BOOKS_FAIL,
        error
    }
}

export function addBook(options = {}) {
    const config = {
        method: 'POST',
        body: JSON.stringify(options),
    }

    return callApi(
        bookApi,
        config,
        null,
        null,
        null,
        false
    )
}

export function editBook(bookID, options = {}) {
    const config = {
        method: 'PATCH',
        body: JSON.stringify(options),
    }

    return callApi(
        bookApi+"/"+bookID,
        config,
        null,
        null,
        null,
        false
    )
}

export function getBookDetail(bookID, options = {}) {
    const config = {
        method: 'GET',
    }

    return callApi(
        bookApi+"/"+bookID,
        config,
        null,
        null,
        null,
        false
    )
}

export function deleteBook(bookID, options = {}) {
    const config = {
        method: 'DELETE',
    }

    return callApi(
        bookApi+"/"+bookID,
        config,
        null,
        null,
        null,
        false
    )
}