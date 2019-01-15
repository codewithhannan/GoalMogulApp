// This is a utils functions
import _ from 'lodash';

/**
 * Url query builder to query URL based on params
 */
export const queryBuilder = (skip, limit, filter) =>
  queryBuilderBasicBuilder({ skip, limit, ...filter });

export const queryBuilderBasicBuilder = (params) =>
  Object
    .keys(params)
    .filter((key) => params[key] !== undefined && params[key] !== '')
    .map(key => {
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

/**
 * Reassign startIndex for tags.
 * If newTag is empty, then we don't do comparison to skip.
 */
export const clearTags = (newContent, newTag, tags) => {
  let tagTextToStartIndexMap = {};
  const newTags = tags
    .sort((a, b) => a.startIndex - b.startIndex)
    .map((t) => {
      const { startIndex, tagText, tagReg, user } = t;
      let position = 1; // Get the first occurane of the index
      if (tagText in tagTextToStartIndexMap) {
        position = tagTextToStartIndexMap[`${tagText}`] + 1;
      }
      // Update map
      tagTextToStartIndexMap[`${tagText}`] = position;

      // Get the new startIndex
      let newStartIndex = getPosition(newContent, tagText, position);

      // It means that we match to the new tag for an old one.
      // Then we need to increase the position by 1
      if (newTag && !_.isEmpty(newTag) && newStartIndex === newTag.startIndex) {
        position += 1;
        tagTextToStartIndexMap[`${tagText}`] = position;
        newStartIndex = getPosition(newContent, tagText, position);
      }

      if (newStartIndex >= newContent.length) {
        // This should never happen unless there is some problem
        console.warn(`Failed to match for tag ${tagText} in content: ${newContent} at ` +
          `position: ${position}`);
          return t;
      }

      return {
        startIndex: newStartIndex,
        endIndex: newStartIndex + tagText.length,
        user,
        tagReg,
        tagText
      };
    });
  return newTags;
};

/**
 * Get the position of nth ocurrance of a substring
 * if no nth occurances found, then it will return the length of the parent string
 */
function getPosition(string, subString, index) {
   return string.split(subString, index).join(subString).length;
}

export const nFormatter = (num, digits) => {
  const si = [
    { value: 1, symbol: '' },
    { value: 1E3, symbol: 'k' },
    { value: 1E6, symbol: 'M' },
    { value: 1E9, symbol: 'G' },
    { value: 1E12, symbol: 'T' },
    { value: 1E15, symbol: 'P' },
    { value: 1E18, symbol: 'E' }
  ];
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  let i;
  for (i = si.length - 1; i > 0; i--) {
    if (num >= si[i].value) {
      break;
    }
  }
  return (num / si[i].value).toFixed(digits).replace(rx, '$1') + si[i].symbol;
};
