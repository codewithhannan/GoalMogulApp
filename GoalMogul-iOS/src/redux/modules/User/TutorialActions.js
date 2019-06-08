/**
 * This file defines all the actions related to step by step Tutorials.js
 */
import { SecureStore } from 'expo';
import _ from 'lodash';
import {
    TUTORIAL_START_TUTORIAL,
    TUTORIAL_NEXT_TUTORIAL_PAGE,
    TUTORIAL_LOAD_TUTORIAL_STATE,
    TUTORIAL_STATE_KEY
} from './Tutorials';
import { Logger } from '../../middleware/utils/Logger';

const DEBUG_KEY = '[ Actions StepTutorials ]';
/**
 * Start a tutorial flow at a page on a step
 * @param {*} flow the flow of tutorial
 * @param {*} page the page to start the tutorial with
 */
export const startTutorial = (flow, page) => (dispatch, getState) => {
    dispatch({
        type: TUTORIAL_START_TUTORIAL,
        payload: {
            flow,
            page
        }
    });
};

/**
 * Show next page in the tutorial
 * @param {string} flow name of the tutorial flow
 * @param {string} page name of the current page in the tutorial flow. Page as to the top most parent component under Router.js
 */
export const showNextTutorialPage = (flow, page) => (dispatch, getState) => {
    dispatch({
        type: TUTORIAL_NEXT_TUTORIAL_PAGE,
        payload: {
            flow,
            page
        }
    });
};

/**
 * Load from aysnc storage of the tutorial state for user. Should be called when user login
 * @param {} userId 
 */
export const loadTutorialState = (userId) => async (dispatch, getState) => {
    const tutorialStateKey = `${TUTORIAL_STATE_KEY}_${userId}`;
  
    const tutorialState = await SecureStore.getItemAsync(tutorialStateKey, {});
  
    // Deserialize the json serialized object
    const parsedTutorialState = JSON.parse(tutorialState);
    Logger.log(`${DEBUG_KEY}: [loadTutorialState] pased json with res:`, parsedTutorialState, 2);
  
    if (!parsedTutorialState || _.isEmpty(parsedTutorialState)) {
        Logger.log(`${DEBUG_KEY}: [loadTutorialState] abort as empty:`, parsedTutorialState, 1);
        return;
    }
  
    dispatch({
        type: TUTORIAL_LOAD_TUTORIAL_STATE,
        payload: {
            data: parsedTutorialState
        }
    });
};

/**
 * Save tutorial state to aysnc storage. Should be called on user logout
 */
export const saveTutorialState = () => async (dispatch, getState) => {
    const { userId } = getState().user;
    let tutorialStateToSave = _.cloneDeep(getState().tutorials);

    // Right now, we manually reset all the showTutorial to false
    tutorialStateToSave = _.set(tutorialStateToSave, 'create_goal.home.showTutorial', false);
    tutorialStateToSave = _.set(tutorialStateToSave, 'create_goal.create_goal_modal.showTutorial', false);
    tutorialStateToSave = _.set(tutorialStateToSave, 'meet_tab_friend.meet_tab.showTutorial', false);

    // Construct key
    const tutorialStateKey = `${TUTORIAL_STATE_KEY}_${userId}`;
    Logger.log(`${DEBUG_KEY}: [saveTutorialState] tutorialStateToSave to store is:`, tutorialStateToSave, 3);

    const dataToStore = JSON.stringify(tutorialStateToSave);
    Logger.log(`${DEBUG_KEY}: [saveTutorialState] data to store is:`, dataToStore, 1);
    const res = await SecureStore.setItemAsync(
        tutorialStateKey, dataToStore, {}
    );
    Logger.log(`${DEBUG_KEY}: [saveTutorialState] done with res: `, res, 1);
    return;
}

/**
 * Currently not supported
 */
export const stopTutorial = () => (dispatch, getState) => {

};
