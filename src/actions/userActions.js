import { callApi } from './../utils/utilsApi';
import { 
    userApi,
    loginApi
} from './../constants/ApiURL';

export const GET_USER_SUCCESS = 'GET_USER_SUCCESS';
export const GET_USER_FAIL = 'GET_USER_FAIL';

export function loginUser(options = {}) {
    const config = {
        method: 'POST',
        body: JSON.stringify(options),
    }

    return callApi(
        loginApi,
        config,
        null,
        userAccess,
        userDeni,
        false
    )
}

function userAccess(data) {
    return {
        type: GET_USER_SUCCESS,
        data: data.data
    }
}

function userDeni(data) {
    return {
        type: GET_USER_FAIL,
    }
}

export function registerUser(options = {}) {
    const config = {
        method: 'POST',
        body: JSON.stringify(options),
    }
    return callApi(
        userApi,
        config,
        null,
        userAccess,
        null,
        false
    )
}

export function updateProfile(options = {}) {
    const config = {
        method: 'PUT',
        body: JSON.stringify(options),
    }
    return callApi(
        userApi,
        config,
        null,
        userAccess,
        null,
        false
    )
}

//Now, we don't have api to get user profile. So, just use it.
export function getUserProfile(options = {}) {
    let user = localStorage.getItem('user');
    if(user) {
        user = JSON.parse(user);
        userAccess(user);
    }
    userDeni();
}