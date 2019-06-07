/**
 * This is the reducer for user step by step tutorial.
 * NOTE: right now we can't resume a step.
 */
import _ from 'lodash';

/**
 * This defines the initial tutorial for an user. Each upper key defines a flow
 */ 
export const INITIAL_TUTORIAL = {
    create_goal: {
        home: {
            nextPage: 'create_goal_modal',
            showTutorial: false,
            hasShown: false,
            totalStep: 1, // Used for onStepChange and check if this is the last step to fire showNextTutorialPage action
            
        },
        create_goal_modal: {
            nextPage: undefined, // This is the last page for this flow
            showTutorial: false,
            hasShown: false,
            totalStep: 1 // Used for onStepChange and check if this is the last step
        },
        hasShown: false
    },
    meet_tab_friend: {
        meet_tab: {
            nextPage: undefined, // This is the last page for this flow
            showTutorial: false,
            hasShown: false,
            totalStep: 3, // Used for onStepChange and check if this is the last step,
            tutorialText: [
                'Click here (Discover Friends) to Discover New Friends',
                'Click here to Invite More Friends so you can share/help one another with goals!',
                'You can run the tutorial again by selecting it from the menu in the upper right corner'
            ]
        },
        hasShown: false
    },
    isOnBoarded: false,
    lastFlow: undefined,
    lastPage: undefined
};

// Mark a reducer[flow][page][showTutorial] = true to start
export const TUTORIAL_START_TUTORIAL = 'tutorial_start_tutorial'; 

// 1. Mark current reducer[flow][page][hasShown] = true, and showTutorial = false
// 2. Mark next [flow][page][nextPage] = true, if nextPage is undefined, just log last page of flow
export const TUTORIAL_NEXT_TUTORIAL_PAGE = 'tutorial_next_tutorial_page';

// TODO: @Jia Tutorial, what should be done here
export const TUTORIAL_LOAD_TUTORIAL_STATE = 'tutorial_load_tutorial_state';

export const TUTORIAL_STOP_TUTORIAL = 'tutorial_stop_tutorial'; 

const DEBUG_KEY = '[ Reducer Tutorials ]';
export default (state = INITIAL_TUTORIAL, action) => {
    switch (action.type) {
        case TUTORIAL_START_TUTORIAL: {
            let newState = _.cloneDeep(state);
            const { flow, page } = action.payload;
            if (!_.has(newState, `${flow}.${page}`)) {
                console.warn(`${DEBUG_KEY}: [ ${action.type} ]: flow: ${flow} and page: ${page} not found`);
                return newState;
            }

            newState = _.set(newState, `${flow}.${page}.showTutorial`, true);
            return newState;
        }

        case TUTORIAL_NEXT_TUTORIAL_PAGE: {
            let newState = _.cloneDeep(state);
            const { flow, page } = action.payload;
            if (!_.has(newState, `${flow}.${page}`)) {
                console.warn(`${DEBUG_KEY}: [ ${action.type} ]: current flow: ${flow} and page: ${page} not found`);
                return newState;
            }

            // Update the state of the current page in the flow
            newState = _.set(newState, `${flow}.${page}.showTutorial`, false);
            newState = _.set(newState, `${flow}.${page}.hasShown`, true);

            // Find the nextPage from the current page
            const nextPage = _.get(newState, `${flow}.${page}.nextPage`);
            if (!nextPage) {
                console.log(`${DEBUG_KEY}: [ ${action.type} ]: last page for flow: ${flow} and page: ${page}`);
                return newState;
            }

            if (!_.has(newState, `${flow}.${nextPage}`)) {
                console.warn(`${DEBUG_KEY}: [ ${action.type} ]: invalid next page: ${nextPage} from flow: ${flow} and page: ${page}`);
                return newState;
            }

            // Update the state of the nextPage to start the tutorial
            newState = _.set(newState, `${flow}.${nextPage}.showTutorial`, true);
            return newState;
        }

        // TODO: @Jia Tutorial, update the tutorial on user login
        case TUTORIAL_LOAD_TUTORIAL_STATE: {
            let newState = _.cloneDeep(state);

            return newState;
        }

        default:
            return { ...state };
    }
};