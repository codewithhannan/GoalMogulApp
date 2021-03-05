/** @format */

import _ from 'lodash'
import { arrayUnique } from '../../middleware/utils'

import { MYEVENT_DETAIL_OPEN, MYEVENT_DETAIL_CLOSE } from './MyEventReducers'

import { EVENT_DELETE_SUCCESS } from './EventReducers'

const INITIAL_STATE = {
    data: [],
    hasNextPage: false,
    limit: 20,
    skip: 0,
    loading: false,
    // ['start', 'created', 'title']
    sortBy: 'created',
    filterOptions: {
        // ['All', 'Invited', 'Interested', 'Going', 'Maybe', 'NotGoing']
        rsvp: 'All',
        // boolean
        isCreator: false,
        // ['Past', 'Upcoming']
        dateRange: 'Upcoming',
    },
    showModal: false,
    navigationState: {
        index: 0,
        routes: [
            { key: 'Upcoming', title: 'Upcoming Events' },
            { key: 'Past', title: 'Past Events' },
        ],
    },
}

const sortByList = ['start', 'created', 'title']

export const MYEVENTTAB_OPEN = 'myeventtab_open'
export const MYEVENTTAB_CLOSE = 'myeventtab_close'
export const MYEVENTTAB_REFRESH_DONE = 'myeventtab_refresh_done'
export const MYEVENTTAB_LOAD_DONE = 'myeventtab_load_done'
export const MYEVENTTAB_LOAD = 'myeventtab_load'
export const MYEVENTTAB_SORTBY = 'myeventtab_sortby'
export const MYEVENTTAB_UPDATE_FILTEROPTIONS = 'myeventtab_update_filteroptions'
export const MYEVENTTAB_UPDATE_TAB = 'myeventtab_update_tab'

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

        // Open the modal
        case MYEVENT_DETAIL_CLOSE:
        case MYEVENTTAB_OPEN: {
            let newState = _.cloneDeep(state)
            return _.set(newState, 'showModal', true)
        }

        // Close the modal
        case MYEVENT_DETAIL_OPEN:
        case MYEVENTTAB_CLOSE: {
            let newState = _.cloneDeep(state)
            return _.set(newState, 'showModal', false)
        }

        // Event refresh done
        case MYEVENTTAB_REFRESH_DONE: {
            const { skip, data, hasNextPage, type } = action.payload
            let newState = _.cloneDeep(state)
            newState = _.set(newState, 'loading', false)

            if (skip !== undefined) {
                newState = _.set(newState, 'skip', skip)
            }
            newState = _.set(newState, 'hasNextPage', hasNextPage)
            return _.set(newState, 'data', data)
        }

        // Event load done.
        case MYEVENTTAB_LOAD_DONE: {
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
        case MYEVENTTAB_LOAD: {
            let newState = _.cloneDeep(state)
            return _.set(newState, 'loading', true)
        }

        // case related to filtering
        case MYEVENTTAB_SORTBY: {
            let newState = _.cloneDeep(state)
            return _.set(newState, 'sortBy', action.payload)
        }

        case MYEVENTTAB_UPDATE_FILTEROPTIONS: {
            // TODO: valid filter options
            const { type, value } = action.payload
            let newState = _.cloneDeep(state)
            return _.set(newState, `filterOptions.${type}`, value)
        }

        // Update tab selection
        case MYEVENTTAB_UPDATE_TAB: {
            const { index } = action.payload
            let newState = _.cloneDeep(state)

            // Update the corresponding state for filter since we just change
            // the filter bar option to tabs
            const { routes } = _.get(newState, 'navigationState')
            newState = _.set(
                newState,
                'filterOptions.dateRange',
                routes[index].key
            )
            return _.set(newState, 'navigationState.index', index)
        }

        default:
            return { ...state }
    }
}
