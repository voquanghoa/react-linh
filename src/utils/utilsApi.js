import "isomorphic-fetch";
const uuidv4 = require('uuid/v4');
export const serverBase = 'http://bm-fe.herokuapp.com/'

export function callApi(
    url,
    config,
    request,
    onRequrestSuccess,
    onRequestFail,
    showLoading
) {
    var headers = new Headers();
    var tokens = getTokens();
    headers.append('x-request-id', uuidv4({msecs: new Date().getTime()}));
    if(config.body) {
        headers.append("Accept", "application/json");
        headers.append("Content-Type", "application/json");
    } else {
        headers.append("Accept", "application/json");
    }
    if (tokens) {
        headers.append("Access-Token", tokens.accessToken);
        headers.append('Client', tokens.client);
        headers.append('Uid', tokens.uid);
    }
    config.headers = headers;
    return dispatch => {
        if (request) {
            dispatch(request);
        }
        return fetch(serverBase+url, config).then(response => {
            if(response.headers.get('Access-Token') && response.headers.get('Client') && response.headers.get('Uid')) {
                setTokens(response.headers.get('Access-Token'), response.headers.get('Client'), response.headers.get('Uid'));
            }
                return response.json();
        }).then(data => {
            if(data.errors) {
                if(onRequestFail) {
                    dispatch(onRequestFail(data.errors));
                }
            }
            if(onRequrestSuccess) {
                dispatch(onRequrestSuccess(data));
            }
            return data;
        }).catch(error => {
            if(onRequestFail) {
                dispatch(onRequestFail(error));
            }
            return error;
        })
    }
}

export function getTokens() {
    let tokens = localStorage.getItem('tokens');
    if (!tokens) return null;
    tokens = JSON.parse(tokens);
    return tokens;
}

export function setTokens(accessToken, client, uid) {
    let tokens = {
        accessToken,
        client,
        uid
    }
    tokens = JSON.stringify(tokens);
    localStorage.setItem('tokens', tokens)
}