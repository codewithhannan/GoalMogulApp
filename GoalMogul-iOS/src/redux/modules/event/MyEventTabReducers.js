import _ from 'lodash';
import { arrayUnique } from '../../middleware/utils';

const INITIAL_STATE = {
  data: [],
  hasNextPage: undefined,
  limit: 20,
  skip: 0,
  loading: false,
  // ['start', 'created', 'title']
  sortBy: 'created',
  filterOptions: {
    // ['Invited', 'Interested', 'Going', 'Maybe', 'NotGoing']
    rspv: 'Invited',
    // boolean
    isCreator: false,
    // ['Past', 'Upcoming']
    dateRange: 'Upcoming'
  },
  showModal: false
};

const sortByList = ['start', 'created', 'title'];

export const MYEVENTTAB_OPEN = 'myeventtab_open';
export const MYEVENTTAB_CLOSE = 'myeventtab_close';
export const MYEVENTTAB_REFRESH_DONE = 'myeventtab_refresh_done';
export const MYEVENTTAB_LOAD_DONE = 'myeventtab_load_done';
export const MYEVENTTAB_LOAD = 'myeventtab_load';
export const MYEVENTTAB_SORTBY = 'myeventtab_sortby';
export const MYEVENTTAB_UPDATE_FILTEROPTIONS = 'myeventtab_update_filteroptions';

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    // Open the modal
    case MYEVENTTAB_OPEN: {
      let newState = _.cloneDeep(state);
      return _.set(newState, 'showModal', true);
    }

    // Close the modal
    case MYEVENTTAB_CLOSE: {
      let newState = _.cloneDeep(state);
      return _.set(newState, 'showModal', false);
    }


    // Event refresh done
    case MYEVENTTAB_REFRESH_DONE: {
      const { skip, data, hasNextPage, type } = action.payload;
      let newState = _.cloneDeep(state);
      newState = _.set(newState, 'loading', false);

      if (skip !== undefined) {
        newState = _.set(newState, 'skip', skip);
      }
      newState = _.set(newState, 'hasNextPage', hasNextPage);
      return _.set(newState, 'data', data);
    }

    // Event load done.
    case MYEVENTTAB_LOAD_DONE: {
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

    // Event tab starts any type of loading
    case MYEVENTTAB_LOAD: {
      let newState = _.cloneDeep(state);
      return _.set(newState, 'loading', true);
    }

    // case related to filtering
    case MYEVENTTAB_SORTBY: {
      let newState = _.cloneDeep(state);
      if (sortByList.includes(action.payload)) {
        return _.set(newState, 'sortBy', action.payload);
      }
      return { ...newState };
    }

    case MYEVENTTAB_UPDATE_FILTEROPTIONS: {
      // TODO: valid filter options
      const { type, value } = action.payload;
      let newState = _.cloneDeep(state);
      return _.set(newState, `filterOptions.${type}`, value);
    }

    default:
      return { ...state };
  }
};
