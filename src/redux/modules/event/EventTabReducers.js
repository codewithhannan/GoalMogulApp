/** @format */

// This stores events information for events under explore
import _ from 'lodash'
import { arrayUnique } from '../../middleware/utils'
import { EVENT_DELETE_SUCCESS } from './EventReducers'

const INITIAL_STATE = {
    data: [],
    hasNextPage: undefined,
    limit: 20,
    skip: 0,
    loading: false,
    refreshing: false,
    // ['Popular', 'RecentlyCreated', 'Random']
    sortBy: 'Popular',
}

const sortByList = ['Popular', 'RecentlyCreated', 'Random']

export const EVENTTAB_REFRESH_DONE = 'eventtab_refresh_done'
export const EVENTTAB_REFRESH = 'eventtab_refresh'
export const EVENTTAB_LOAD_DONE = 'eventtab_load_done'
export const EVENTTAB_LOAD = 'eventtab_load'
export const EVENTTAB_SORTBY = 'eventtab_sortby'
export const EVENTTAB_UPDATE_FILTEROPTIONS = 'eventtab_update_filteroptions'

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        // One event is deleted
        case EVENT_DELETE_SUCCESS: {
            const { eventId } = action.payload
            const newState = _.cloneDeep(state)
            const oldData = _.get(newState, 'data')
            const newData = oldData.filter((e) => e._id !== eventId)
            return _.set(newState, 'data', newData)
        }

        case EVENTTAB_REFRESH: {
            let newState = _.cloneDeep(state)
            newState = _.set(newState, 'refreshing', true)
            return newState
        }

        // Event refresh done
        case EVENTTAB_REFRESH_DONE: {
            const { skip, data, hasNextPage, type } = action.payload
            let newState = _.cloneDeep(state)
            newState = _.set(newState, 'refreshing', false)

            if (skip !== undefined) {
                newState = _.set(newState, 'skip', skip)
            }
            newState = _.set(newState, 'hasNextPage', hasNextPage)
            return _.set(newState, 'data', data)
        }

        // Event load done.
        case EVENTTAB_LOAD_DONE: {
            const { skip, data, hasNextPage, type } = action.payload
            let newState = _.cloneDeep(state)
            newState = _.set(newState, 'loading', false)

            if (skip !== undefined) {
                newState = _.set(newState, 'skip', skip)
            }
            newState = _.set(newState, 'hasNextPage', hasNextPage)
            const oldData = _.get(newState, 'data')
            return _.set(newState, 'data', arrayUnique(oldData.concat(data)))
        }

        // Event tab starts any type of loading
        case EVENTTAB_LOAD: {
            let newState = _.cloneDeep(state)
            return _.set(newState, 'loading', true)
        }

        // case related to filtering
        case EVENTTAB_SORTBY: {
            let newState = _.cloneDeep(state)
            if (sortByList.includes(action.payload)) {
                return _.set(newState, 'sortBy', action.payload)
            }
            return { ...newState }
        }

        case EVENTTAB_UPDATE_FILTEROPTIONS: {
            // TODO: valid filter options
            let newState = _.cloneDeep(state)
            return _.set(newState, 'filterOptions', action.payload)
        }

        default:
            return { ...state }
    }
}
