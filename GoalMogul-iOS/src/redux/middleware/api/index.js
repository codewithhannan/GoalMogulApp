import { Logger } from '../utils/Logger';
import R from 'ramda';
import getEnvVars from '../../../../environment';

const DEBUG_KEY = '[ API ]';
const config = getEnvVars();

export const singleFetch = (path, payload, method, token, logLevel) =>
  fetchData(path, payload, method, token, logLevel).then((res) => {
    if (!res.ok || !res.status === 200) {
      console.log(`Fetch failed with error status: ${res.status}.`);
    }
    return new Promise(async (resolve, reject) => {
      res
        .json()
        .then((data) => {
          resolve({
            ...data,
            status: res.status
          });
        })
        .catch((err) => {
          reject(err);
        });
    });
  });

const fetchData = R.curry((path, payload = {}, method = 'get', token, logLevel) => {
  // Generate headers
  const headers = ((requestType) => {
    switch (requestType) {
      case 'get': {
        return {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'x-access-token': token
          }
        };
      }
      case 'put':
      case 'delete':
      case 'post': {
        return {
          method: method.toUpperCase(),
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            ...payload,
            token
          })
        };
      }

      default:
        return '';
    }
  })(method.toLowerCase());

  // Generate url
  const url = `${config.url}${path}`;

  // Only log the request if logLevel is smaller than the global config log level
  Logger.log(`${DEBUG_KEY} url is: ${url}`, null, logLevel);
  Logger.log(`${DEBUG_KEY} header is: `, headers, logLevel);
  return fetch(url, headers);
});

export const api = {
  get(path, token, logLevel = 3) {
    return singleFetch(path, null, 'get', token, logLevel);
  },
  getPromise(path, token, logLevel = 3) {
    return fetchData(path, null, 'get', token, logLevel);
  },
  post(path, payload, token, logLevel = 3) {
    return singleFetch(path, payload, 'post', token, logLevel);
  },
  put(path, payload, token, logLevel = 3) {
    return singleFetch(path, payload, 'put', token, logLevel);
  },
  delete(path, payload, token, logLevel = 3) {
    return singleFetch(path, payload, 'delete', token, logLevel);
  }
};

export const BASE_API_URL = config.url;