import { config } from './config';
import R from 'ramda';

const DEBUG_KEY = '[ API ]';

export const singleFetch = (path, payload, method, token) =>
  fetchData(path, payload, method, token).then((res) => {
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

const fetchData = R.curry((path, payload = {}, method = 'get', token) => {
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
  console.log(`${DEBUG_KEY} url is: ${url}`);
  console.log(`${DEBUG_KEY} header is: `, headers);
  return fetch(url, headers);
});

export const api = {
  get(path, token) {
    return singleFetch(path, null, 'get', token);
  },
  getPromise(path, token) {
    return fetchData(path, null, 'get', token);
  },
  post(path, payload, token) {
    return singleFetch(path, payload, 'post', token);
  },
  put(path, payload, token) {
    return singleFetch(path, payload, 'put', token);
  },
  delete(path, payload, token) {
    return singleFetch(path, payload, 'delete', token);
  }
};
