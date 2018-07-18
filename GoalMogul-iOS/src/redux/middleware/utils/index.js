// This is a utils functions for netowrk

/**
 * Url query builder to query URL based on params
 */
export const queryBuilder = (skip, limit, filter) =>
  queryBuilderBasicBuilder({ skip, limit, ...filter });

export const queryBuilderBasicBuilder = (params) =>
  Object.keys(params).map(key => `${key}=${params[key]}`).join('&');
