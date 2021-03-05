/** @format */

import _ from 'lodash'

export const initialState = {
    scene: {},
    stack: [],
    state: {},
    tab: undefined,
}

// main navigation routes for the application
export const MAIN_NAVIGATION_ROUTES = [
    'homeTab',
    'profileTab',
    'notificationTab',
    'exploreTab',
    'chatTab',
]

export default (state = initialState, action = {}) => {
    switch (action.type) {
        case 'Navigation/NAVIGATE': {
            const newState = _.cloneDeep(state)
            const { routeName } = action
            if (!routeName) return newState

            let route
            if (routeName === 'mainTabs') route = 'homeTab'
            if (!MAIN_NAVIGATION_ROUTES.some((r) => r === routeName)) {
                return newState
            }
            route = routeName
            return _.set(newState, 'tab', route)
        }

        default:
            return { ...state }
    }
}
