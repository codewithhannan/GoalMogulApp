import _ from 'lodash';

const initialState = {
    scene: {},
    stack: [],
    state: {},
    tab: undefined
};

const routes = ['homeTab', 'profileTab', 'notificationTab', 'exploreTab', 'chatTab'];

export default (state = initialState, action = {}) => {
    switch (action.type) {
        case 'Navigation/NAVIGATE': {
            const newState = _.cloneDeep(state);
            const { routeName } = action;
            if (!routeName) return newState;

            let route;
            if (routeName === 'mainTabs') route = 'homeTab';
            if (!routes.some((r) => r === routeName)) {
                return newState;
            }
            route = routeName;
            return _.set(newState, 'tab', route);
        }

        default:
            return { ...state };
    }
};
