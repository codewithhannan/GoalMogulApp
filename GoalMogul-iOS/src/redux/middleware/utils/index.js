// This is a utils functions for netowrk

/**
 * Url query builder to query URL based on params
 */
const queryBuilder = (skip, limit, filter) =>
  queryBuilderBasicBuilder({ skip, limit, ...filter });

const queryBuilderBasicBuilder = (params) =>
  Object.keys(params).map(key => `${key}=${params[key]}`).join('&');

export const Utils = {
  queryBuilder,
  queryBuilderBasicBuilder
};
