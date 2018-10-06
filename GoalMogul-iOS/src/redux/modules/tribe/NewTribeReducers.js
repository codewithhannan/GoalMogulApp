// New Tribe will mainly store in NewTribeModalForm. This reducer is called newTribe
import _ from 'lodash';
import { arrayUnique } from '../../middleware/utils';

const INITIAL_STATE = {
  // name: undefined,
  // membersCanInvite: undefined,
  // isPubliclyVisible: false,
  // membershipLimit: 100,
  // description: '',
  // picture: undefined,
  uploading: false
};

export const TRIBE_NEW_SUBMIT = 'tribe_new_submit';
export const TRIBE_NEW_SUBMIT_SUCCESS = 'tribe_new_submit_success';
export const TRIBE_NEW_SUBMIT_FAIL = 'tribe_new_submit_fail';

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case TRIBE_NEW_SUBMIT: {
      const newState = _.cloneDeep(state);
      return _.set(newState, 'uploading', true);
    }

    case TRIBE_NEW_SUBMIT_FAIL: {
      const newState = _.cloneDeep(state);
      return _.set(newState, 'uploading', false);
    }

    case TRIBE_NEW_SUBMIT_SUCCESS: {
      const newState = _.cloneDeep(state);
      return _.set(newState, 'uploading', false);
    }

    default: return { ...state };
  }
};
