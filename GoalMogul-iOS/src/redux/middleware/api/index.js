/** @format */

import R from 'ramda'
import getEnvVars from '../../../../environment'
import { decode } from '../utils'
import { Logger } from '../utils/Logger'
import TokenService from '../../../services/token/TokenService'

const DEBUG_KEY = '[ API ]'
const config = getEnvVars()

export const singleFetch = (path, payload, method, token, logLevel) =>
    fetchData(path, payload, method, logLevel).then((res) => {
        if (!res.ok || !res.status === 200) {
            console.log(
                `Fetch failed with error status: ${res.status} for path: ${path}`
            )
        }
        return new Promise(async (resolve, reject) => {
            res.json()
                .then((data) => {
                    let decodedData = escapeObj(data)
                    resolve({
                        ...decodedData,
                        status: res.status,
                    })
                })
                .catch((err) => {
                    reject(err)
                })
        })
    })

const fetchData = R.curry(
    async (path, payload = {}, method = 'get', logLevel) => {
        // Get token
        let authToken
        if (path && !path.startsWith('pub/')) {
            // Need to get token since this is not a public endpoint
            try {
                authToken = await TokenService.getAuthToken()
            } catch (err) {
                // TODO: sentry logging error for this request
                // TODO: we can add retry later on
                // Best effort
            }
        }

        // Generate headers
        const headers = ((requestType) => {
            switch (requestType) {
                case 'get': {
                    return {
                        method: 'GET',
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json',
                            'x-access-token': authToken,
                        },
                    }
                }
                case 'put':
                case 'delete':
                case 'post': {
                    return {
                        method: method.toUpperCase(),
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            ...payload,
                            token: authToken,
                        }),
                    }
                }

                default:
                    return ''
            }
        })(method.toLowerCase())

        // Generate url
        const url = `${config.url}${path}`

        // Only log the request if logLevel is smaller than the global config log level
        Logger.log(`${DEBUG_KEY} url is: ${url}`, null, logLevel)
        Logger.log(`${DEBUG_KEY} header is: `, headers, logLevel)
        return fetch(url, headers)
    }
)

function escapeObj(obj) {
    if (obj == null) return obj
    if (!Array.isArray(obj) && typeof obj != 'object') return obj
    return Object.keys(obj).reduce(
        function (acc, key) {
            acc[key] =
                typeof obj[key] == 'string'
                    ? decode(obj[key])
                    : escapeObj(obj[key])
            return acc
        },
        Array.isArray(obj) ? [] : {}
    )
}

export const api = {
    get(path, token, logLevel = 3) {
        return singleFetch(path, null, 'get', token, logLevel)
    },
    getPromise(path, token, logLevel = 3) {
        return fetchData(path, null, 'get', token, logLevel)
    },
    post(path, payload, token, logLevel = 3) {
        return singleFetch(path, payload, 'post', token, logLevel)
    },
    put(path, payload, token, logLevel = 3) {
        return singleFetch(path, payload, 'put', token, logLevel)
    },
    delete(path, payload, token, logLevel = 3) {
        return singleFetch(path, payload, 'delete', token, logLevel)
    },
}

export const BASE_API_URL = config.url
