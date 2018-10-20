// This reducer stores information for my tribes
import _ from 'lodash';
import { arrayUnique } from '../../middleware/utils';

import {
  MYTRIBE_DETAIL_OPEN,
  MYTRIBE_DETAIL_CLOSE
} from './MyTribeReducers';

const INITIAL_STATE = {
  data: [],
  hasNextPage: undefined,
  limit: 20,
  skip: 0,
  loading: false,
  // ['name', 'created']
  sortBy: 'created',
  // ['Admin', 'Member', 'JoinRequester', 'Invitee']
  filterForMembershipCategory: 'Admin',
  showModal: false
};

const sortByList = ['start', 'created', 'title'];

export const MYTRIBETAB_OPEN = 'mytribetab_open';
export const MYTRIBETAB_CLOSE = 'mytribetab_close';
export const MYTRIBETAB_REFRESH_DONE = 'mytribetab_refresh_done';
export const MYTRIBETAB_LOAD_DONE = 'mytribetab_load_done';
export const MYTRIBETAB_LOAD = 'mytribetab_load';
export const MYTRIBETAB_SORTBY = 'mytribetab_sortby';
export const MYTRIBETAB_UPDATE_FILTEROPTIONS = 'mytribetab_update_filteroptions';

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    // Open my tribe modal
    case MYTRIBE_DETAIL_CLOSE:
    case MYTRIBETAB_OPEN: {
      const newState = _.cloneDeep(state);
      return _.set(newState, 'showModal', true);
    }

    // Open my event modal
    case MYTRIBE_DETAIL_OPEN:
    case MYTRIBETAB_CLOSE: {
      const newState = _.cloneDeep(state);
      return _.set(newState, 'showModal', false);
    }

    // Tribe refresh done
    case MYTRIBETAB_REFRESH_DONE: {
      const { skip, data, hasNextPage, type } = action.payload;
      let newState = _.cloneDeep(state);
      newState = _.set(newState, 'loading', false);

      if (skip !== undefined) {
        newState = _.set(newState, 'skip', skip);
      }
      newState = _.set(newState, 'hasNextPage', hasNextPage);
      return _.set(newState, 'data', data);
    }

    // Tribe load done.
    case MYTRIBETAB_LOAD_DONE: {
      const { skip, data, hasNextPage, type } = action.payload;
      let newState = _.cloneDeep(state);
      newState = _.set(newState, 'loading', false);

      if (skip !== undefined) {
        newState = _.set(newState, 'skip', skip);
      }
      newState = _.set(newState, 'hasNextPage', hasNextPage);
      const oldData = _.get(newState, 'data');
      return _.set(newState, 'data', arrayUnique(oldData.concat(data)));
    }

    // Tribe tab starts any type of loading
    case MYTRIBETAB_LOAD: {
      let newState = _.cloneDeep(state);
      return _.set(newState, 'loading', true);
    }

    // case related to filtering
    case MYTRIBETAB_SORTBY: {
      let newState = _.cloneDeep(state);
      if (sortByList.includes(action.payload)) {
        return _.set(newState, 'sortBy', action.payload);
      }
      return { ...newState };
    }

    case MYTRIBETAB_UPDATE_FILTEROPTIONS: {
      // TODO: valid filter options
      let newState = _.cloneDeep(state);
      return _.set(newState, 'filterForMembershipCategory', action.payload);
    }

    default:
      return { ...state };
  }
};
