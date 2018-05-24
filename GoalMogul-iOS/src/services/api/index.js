import * as config from './config';

export const fetchApi = (path, payload = { type: '', data: {} }, method = 'get', token) => {
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
        }
      }
      case 'put':
      case 'post': {
        const { type, data } = payload;
        return {
          method: method.toUpperCase(),
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            `${type}`: data,
            token
          })
        }
      }

      // TODO: implement delete
      case 'delete': {
        return ''
      }

      default:
        return '';
    }
  })(method);

  // Generate url
  const url = `${config.url}``${path}`;

  return fetch(url, headers).then((res) => res.json())
}
