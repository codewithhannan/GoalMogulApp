// This is a utils functions for netowrk

/**
 * Url query builder to query URL based on params
 */
export const queryBuilder = (skip, limit, filter) =>
  queryBuilderBasicBuilder({ skip, limit, ...filter });

export const queryBuilderBasicBuilder = (params) =>
  Object.keys(params).map(key => `${key}=${params[key]}`).join('&');

export const arrayUnique = (array) => {
  let a = array.concat();
  for (let i = 0; i < a.length; ++i) {
    for (let j = i + 1; j < a.length; ++j) {
      if (a[i]._id === a[j]._id) {
        a.splice(j--, 1);
      }
    }
  }

  return a;
};
