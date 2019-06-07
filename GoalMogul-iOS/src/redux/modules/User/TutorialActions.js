/**
 * This file defines all the actions related to step by step Tutorials.js
 */
import {
    TUTORIAL_START_TUTORIAL,
    TUTORIAL_NEXT_TUTORIAL_PAGE
} from './Tutorials';

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
 * Currently not supported
 */
export const stopTutorial = () => (dispatch, getState) => {

};
