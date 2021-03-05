/**
 * This reducer stores information for recommended tribes.
 * TODO: merge with explore tab since they are actually the same thing
 *
 * @format
 */

import _ from 'lodash'
import { arrayUnique } from '../../middleware/utils'

import { MYTRIBE_DELETE_SUCCESS } from './Tribes'

const INITIAL_STATE = {
    data: [],
    hasNextPage: undefined,
    limit: 20,
    skip: 0,
    loading: false,
    refreshing: false,
    // ['Popular', 'RecentlyCreated', 'Random']
    sortBy: 'Name',
}

const sortByList = ['Popular', 'RecentlyCreated', 'Random']

export const TRIBETAB_REFRESH_DONE = 'tribetab_refresh_done'
export const TRIBETAB_REFRESH = 'tribetab_refresh'
export const TRIBETAB_LOAD_DONE = 'tribetab_load_done'
export const TRIBETAB_LOAD = 'tribetab_load'
export const TRIBETAB_SORTBY = 'tribetab_sortby'
export const TRIBETAB_UPDATE_FILTEROPTIONS = 'tribetab_update_filteroptions'

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case TRIBETAB_REFRESH: {
            let newState = _.cloneDeep(state)
            newState = _.set(newState, 'refreshing', true)
            return newState
        }

        // Tribe refresh done
        case TRIBETAB_REFRESH_DONE: {
            const { skip, data, hasNextPage, type } = action.payload
            let newState = _.cloneDeep(state)
            newState = _.set(newState, 'refreshing', false)

            if (skip !== undefined) {
                newState = _.set(newState, 'skip', skip)
            }
            newState = _.set(newState, 'hasNextPage', hasNextPage)
            return _.set(newState, 'data', data)
        }

        // Tribe tab starts any type of loading
        case TRIBETAB_LOAD: {
            let newState = _.cloneDeep(state)
            return _.set(newState, 'loading', true)
        }

        // Tribe load done.
        case TRIBETAB_LOAD_DONE: {
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

        // One tribe is deleted
        case MYTRIBE_DELETE_SUCCESS: {
            const { tribeId } = action.payload
            const newState = _.cloneDeep(state)
            const oldData = _.get(newState, 'data')
            const newData = oldData.filter((t) => t._id !== tribeId)
            return _.set(newState, 'data', newData)
        }

        // case related to filtering
        case TRIBETAB_SORTBY: {
            let newState = _.cloneDeep(state)
            if (sortByList.includes(action.payload)) {
                return _.set(newState, 'sortBy', action.payload)
            }
            return { ...newState }
        }

        case TRIBETAB_UPDATE_FILTEROPTIONS: {
            // TODO: valid filter options
            let newState = _.cloneDeep(state)
            return _.set(
                newState,
                'filterForMembershipCategory',
                action.payload
            )
        }

        default:
            return { ...state }
    }
}
