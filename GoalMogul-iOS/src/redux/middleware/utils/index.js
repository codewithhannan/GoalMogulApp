// This is a utils functions
import _ from 'lodash';

// Assets
import ShareIcon from '../../../asset/utils/forward.png';
import EditIcon from '../../../asset/utils/edit.png';
import CheckIcon from '../../../asset/utils/check.png';
import UndoIcon from '../../../asset/utils/undo.png';
import TrashIcon from '../../../asset/utils/trash.png';

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
const DEBUG_KEY = '[ Utils index ]';
export const clearTags = (newContent, newTag, tags = []) => {
  // console.log(`${DEBUG_KEY}: [ clearTags ]: newContent:`, newContent);
  // console.log(`${DEBUG_KEY}: [ clearTags ]: newTag:`, newTag);
  // console.log(`${DEBUG_KEY}: [ clearTags ]: tags:`, tags);
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
      // console.log(`${DEBUG_KEY}: [ clearTags ]: startIndex is:`, newStartIndex);

      // It means that we match to the new tag for an old one.
      // Then we need to increase the position by 1
      if (newTag && !_.isEmpty(newTag) && newStartIndex === newTag.startIndex) {
        position += 1;
        tagTextToStartIndexMap[`${tagText}`] = position;
        newStartIndex = getPosition(newContent, tagText, position);
      }

      if (newStartIndex >= newContent.length) {
        // This might happen if we reselect the same tag at the same position after we backspace 
        // to trigger suggestion search again
        // Otherwise This should never happen unless there is some problem
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
 * Given content and its tags, we sanitize the tags to make sure all tags have its
 * corresponding text in content.
 * 
 * This is created to handle the corner case where use back space from the middle of 
 * a tag like {@Jia Zeng} starting from Jia and system will fail to remove the tag 
 * for Jia Zeng at that position.
 * 
 * Since trigger text @ no longer exists for that tag, we should sanitize to remove that
 * tag from the list
 * @param {*} content 
 * @param {*} tags 
 */
export const sanitizeTags = (content, tags) => {
  // We need to reassign position since this is triggered after deletion
  const tagsToSanitize = clearTags(content, {}, tags);

  const tagToReturn = tagsToSanitize
    .map((t) => {
      const { startIndex, tagText, endIndex } = t;
      const textInContent = content.slice(startIndex, endIndex);
      if (textInContent !== tagText) {
        // This is good since we filter the unwanted / dangling tags
        console.warn(`${DEBUG_KEY}: [ sanitizeTags ]: can't find tag in content: ${content}. Tag:`, t);
        return {};
      }
      return t;
    })
    .filter((t) => !_.isEmpty(t));

  return tagToReturn;
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

export const generateInvitationLink = (inviteCode) => {
  const BASE_CODE = 'https://web.goalmogul.com/invite?inviteCode=';
  return `${BASE_CODE}${inviteCode}`;
};

export const PAGE_TYPE_MAP = {
  user_profile_detail: 'USER_DETAIL',
  user: 'USER',
  goal: 'GOAL',
  post: 'POST',
  event: 'EVENT',
  tribe: 'TRIBE',
  goalFeed: 'GOAL_FEED',
  activity: 'ACTIVITY',
  chat: 'CHAT',
};

// const DEBUG_KEY = '[ Utils ]';
export const hasTypePrefix = (type, key) => {
  // console.log(`${DEBUG_KEY}: [ hasTypePrefix ] isString: ${isString(key)}`);
  if (key === undefined || !isString(key)) {
    return false;
  }

  if (!Object.keys(PAGE_TYPE_MAP).some(t => t === type)) {
    return false;
  }
  const typePrefix = _.get(PAGE_TYPE_MAP, type);
  // console.log(`${DEBUG_KEY}: [ hasTypePrefix ] typePrefix: ${typePrefix}`);

  const keys = key.split('_');
  // console.log(`${DEBUG_KEY}: [ hasTypePrefix ] keys: `, keys);
  return (keys[0] === typePrefix);
};

export function isString(value) {
  return typeof value === 'string' || value instanceof String;
}

/**
 * Contruct pageId based on page type
 * @param {*} type 
 * @param {*} DEBUG_KEY 
 */
export const constructPageId = (type, DEBUG_KEY = '[ Utils constructPageId ]') => {
  const prefix = _.get(PAGE_TYPE_MAP, `${type}`);
  if (prefix === undefined || _.isEmpty(prefix)) {
    console.warn(`${DEBUG_KEY}: fail to construct page Id for type: ${type}`);
  }
  
  const currentTime = new Date();
  return `${prefix}_${currentTime.getTime()}`;
};

/**
 * Construct component key by tab and base key
 * @param {*} tab 
 * @param {*} key 
 */
export const componentKeyByTab = (tab, key) => {
  let ret = key;
  if (tab !== 'homeTab' && tab !== undefined) {
    ret = `${tab}_${key}`;
  }
  return ret;
};

/**
 * 
 */
export const makeCaretOptions = (type, goalRef, postRef) => {
  if (type === 'Post') {
    if (!postRef) {
      // Invalid postRef
      console.warn(`[ Utils ]: [ makeCaretOptions ]: invalid postRef`, postRef);
      return [];
    }

    // This is a post
    if (postRef.postType === 'General') {
      return [
        { option: 'Delete' },
        { option: 'Edit Post' }
      ];
    }
    
    // This is a share
    return [
      { option: 'Delete' },
    ];
  }

  if (type === 'Goal') {
    if (!goalRef) {
      // Invalid goalRef
      console.warn(`[ Utils ]: [ makeCaretOptions ]: invalid goalRef`, goalRef);
      return [];
    } 
    const { isCompleted } = goalRef;
    return [
      { option: 'Edit Goal', iconSource: EditIcon },
      { option: 'Share to Goal Feed', iconSource: ShareIcon },
      { option: isCompleted ? 'Unmark as Complete' : 'Mark as Complete',
        iconSource: isCompleted ? UndoIcon : CheckIcon },
      { option: 'Delete', iconSource: TrashIcon },
    ];
  }

  console.warn(`[ Utils ]: [ makeCaretOptions ]: invalid type`, type);
  return [];
};
