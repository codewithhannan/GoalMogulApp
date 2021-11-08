/** @format */

import axios from 'axios'

export const postWithParams = async (url, token, params = {}, headers = {}) => {
    let config = {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/x-www-form-urlencoded',
            ...headers,
        },
        params: {
            ...params,
        },
    }

    let returnValue

    await axios
        .post(url, token, params)
        .then((result) => {
            returnValue = { result: result, error: null }
        })
        .catch((err) => {
            returnValue = { result: null, error: err }
        })
    return returnValue
}

export const postRequest = async (url, body = {}, headers = {}) => {
    // let xform = qs.stringify(body)

    // if(baseURL=='https://api.volatia.com/api/WorkOrders/Create')

    let config = {
        headers: {
            ...headers,
        },
    }

    let returnValue

    await axios
        .post(url, body, config)
        .then((result) => {
            returnValue = { result: result, error: null }
        })
        .catch((err) => {
            returnValue = { result: null, error: err }
        })
    return returnValue
}
export const putRequest = async (url, body = {}, headers = {}) => {
    // let xform = qs.stringify(body)

    // if(baseURL=='https://api.volatia.com/api/WorkOrders/Create')

    let config = {
        headers: {
            ...headers,
        },
    }

    let returnValue

    await axios
        .put(url, body, config)
        .then((result) => {
            returnValue = { result: result, error: null }
        })
        .catch((err) => {
            returnValue = { result: null, error: err }
        })
    return returnValue
}

export const getRequest = async (url, body = {}, headers = {}) => {
    let config = {
        headers: {
            ...headers,
        },
        params: {
            ...params,
        },
    }

    let returnValue

    await axios
        .get(url, body, config)
        .then((result) => {
            returnValue = { result: result, error: null }
        })
        .catch((err) => {
            returnValue = { result: null, error: err }
        })
    return returnValue
}
