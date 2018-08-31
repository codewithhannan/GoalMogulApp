import _ from 'lodash';
import { arrayUnique } from '../../middleware/utils';

const INITIAL_STATE = {
  data: [],
  hasNextPage: undefined,
  limit: 20,
  skip: 0,
  loading: false,
  // ['name', 'created']
  sortBy: 'created',
  // ['Admin', 'Member', 'JoinRequester', 'Invitee']
  filterForMembershipCategory: 'Admin'
};

const sortByList = ['start', 'created', 'title'];

export const TRIBETAB_REFRESH_DONE = 'tribetab_refresh_done';
export const TRIBETAB_LOAD_DONE = 'tribetab_load_done';
export const TRIBETAB_LOAD = 'tribetab_load';
export const TRIBETAB_SORTBY = 'tribetab_sortby';
export const TRIBETAB_UPDATE_FILTEROPTIONS = 'tribetab_update_filteroptions';

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    // Tribe refresh done
    case TRIBETAB_REFRESH_DONE: {
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
    case TRIBETAB_LOAD_DONE: {
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
    case TRIBETAB_LOAD: {
      let newState = _.cloneDeep(state);
      return _.set(newState, 'loading', true);
    }

    // case related to filtering
    case TRIBETAB_SORTBY: {
      let newState = _.cloneDeep(state);
      if (sortByList.includes(action.payload)) {
        return _.set(newState, 'sortBy', action.payload);
      }
      return { ...newState };
    }

    case TRIBETAB_UPDATE_FILTEROPTIONS: {
      // TODO: valid filter options
      let newState = _.cloneDeep(state);
      return _.set(newState, 'filterForMembershipCategory', action.payload);
    }

    default:
      return { ...state };
  }
};