/** @format */

// This reducer stores information for my tribes
import { Actions } from 'react-native-router-flux'
import {
    MYTRIBETAB_REFRESH_DONE,
    MYTRIBETAB_LOAD,
    MYTRIBETAB_SORTBY,
    MYTRIBETAB_UPDATE_FILTEROPTIONS,
    MYTRIBETAB_OPEN,
    MYTRIBETAB_CLOSE,
    MYTRIBETAB_UPDATE_TAB,
} from './MyTribeTabReducers'

import { api as API } from '../../middleware/api'
import { queryBuilder, componentKeyByTab } from '../../middleware/utils'

const DEBUG_KEY = '[ Action MyTribeTab ]'
const BASE_ROUTE = 'secure/tribe'

// Open my tribe modal
export const openMyTribeTab = () => (dispatch, getState) => {
    const { tab } = getState().navigation
    const pageId = 'tribe_hub_pageId'
    dispatch({
        type: MYTRIBETAB_OPEN,
    })
    const componentToOpen = componentKeyByTab(tab, 'myTribeTab')
    Actions.push(componentToOpen, { pageId: pageId })
    refreshTribe()(dispatch, getState)
}

// Close my tribe modal
export const closeMyTribeTab = () => (dispatch) => {
    console.log('closing my tribe tab')
    Actions.pop()
    dispatch({
        type: MYTRIBETAB_CLOSE,
    })
}

// update sortBy
export const updateSortBy = (value) => (dispatch, getState) => {
    dispatch({
        type: MYTRIBETAB_SORTBY,
        payload: value,
    })

    refreshTribe()(dispatch, getState)
}

// update filterForMembershipCategory
export const updateFilterForMembershipCategory = (value) => (
    dispatch,
    getState
) => {
    dispatch({
        type: MYTRIBETAB_UPDATE_FILTEROPTIONS,
        payload: value,
    })

    refreshTribe()(dispatch, getState)
}

/**
 * For the next three functions, we could abstract a pattern since
 * It's shared across mastermind/actions, feed/actions, MeetActions, ProfileActions, EventTabActions
 * NOTE: goal feed and activity feed share the same constants with different
 * input on type field
 */
