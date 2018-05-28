import { config } from './config';

export const fetchApi = (path, payload = {}, method = 'get', token) => {
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

  console.log('headers are: ', headers);
  console.log('url is: ', url);
  return fetch(url, headers).then((res) => res.json())
};

export const api = {
  get(path, token) {
    return fetchApi(path, null, 'get', token);
  },
  post(path, payload, token) {
    return fetchApi(path, payload, 'post', token);
  },
  put(path, payload, token) {
    return fetchApi(path, payload, 'put', token);
  },
  delete(path, payload, token) {
    return fetchApi(path, payload, 'delete', token);
  }
};
