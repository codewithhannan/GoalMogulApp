// This is a utils functions
import _ from 'lodash';

/**
 * Url query builder to query URL based on params
 */
export const queryBuilder = (skip, limit, filter) =>
  queryBuilderBasicBuilder({ skip, limit, ...filter });

export const queryBuilderBasicBuilder = (params) =>
  Object.keys(params).map(key => {
    if (params[key] !== null && typeof params[key] === 'object') {
      return `${key}=${JSON.stringify(params[key])}`;
    }
    return `${key}=${params[key]}`;
  }).join('&');

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

/* Functions to create switch cases */
export const switchCase = cases => defaultCase => key =>
  (cases.hasOwnProperty(key) ? cases[key] : defaultCase);

const executeIfFunction = f => (f instanceof Function ? f() : f);

export const switchCaseF = cases => defaultCase => key =>
  executeIfFunction(switchCase(cases)(defaultCase)(key));

const executeIfFunctionWithVal = (f, val) => (f instanceof Function ? f(val) : f);

export const switchCaseFWithVal = values => cases => defaultCase => key =>
  executeIfFunctionWithVal(switchCase(cases)(defaultCase)(key), values);

// const switchCaseF = cases => ({
//   withDefaultCase(defaultCase) {
//     return {
//       execute(key) {
//         return executeIfFunction(switchCase(cases)(defaultCase)(key));
//       }
//     }
//   }
// })

/* Functions to set state and skip if undefined */
export const setState = (newState, path, data) => {
    // If data exists or original field is set, then we set explicitly.
    if (data || _.get(newState, `${path}`)) return _.set(newState, `${path}`, data);
    return newState;
  };

/**
 * Helper functions
 */
export const capitalizeWord = (word) => {
  if (!word) return '';
  return word.replace(/^\w/, c => c.toUpperCase());
};
