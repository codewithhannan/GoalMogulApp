/**
 * This file defines all the actions related to step by step Tutorials.js
 *
 * Here are usage summary of thses major API
 *
 * startTutorial: this is used when we want to start a tutorial by updating its reducer state
 * where its component has componentDidUpdate to call this.props.start()
 *
 * pauseTutorial: this is used when we want to stop a tutorial and pass in a nextStepNumber as
 * check poinst file. This function servers as a pause function
 *
 * showNextTutorialPage: this means the end of a tutorial flow on a page. It does 2 things
 * 1. Mark current page as shown and update the nextStepNumber to zero
 * 2. Find the next page to update the showTutorial to true and set the nextStepNumber for the next page
 *
 * updateNextStepNumber
 *
 * @format
 */

import * as SecureStore from 'expo-secure-store'
import _ from 'lodash'
import {
    TUTORIAL_START_TUTORIAL,
    TUTORIAL_NEXT_TUTORIAL_PAGE,
    TUTORIAL_LOAD_TUTORIAL_STATE,
    TUTORIAL_MARK_USER_ONBOARDED,
    TUTORIAL_STATE_KEY,
    TUTORIAL_UPDATE_CURRENT_STEP_NUMBER,
    TUTORIAL_PAUSE_TUTORIAL,
    TUTORIAL_RESET_TUTORIAL,
} from './Tutorials'
import { Logger } from '../../middleware/utils/Logger'
import { api as API } from '../../middleware/api'
import { track, EVENT as E } from '../../../monitoring/segment'
import TokenService from '../../../services/token/TokenService'
import AsyncStorage from '@react-native-async-storage/async-storage'

const DEBUG_KEY = '[ Actions StepTutorials ]'
/**
 * Start a tutorial flow at a page on a step
 * @param {*} flow the flow of tutorial
 * @param {*} page the page to start the tutorial with
 */
export const startTutorial = (flow, page) => (dispatch, getState) => {
    // track(E.TUTORIAL_STARTED)
    dispatch({
        type: TUTORIAL_START_TUTORIAL,
        payload: {
            flow,
            page,
        },
    })
}

/**
 * Show next page in the tutorial
 * @param {string} flow name of the tutorial flow
 * @param {string} page name of the current page in the tutorial flow. Page as to the top most parent component under Router.js
 */
export const showNextTutorialPage = (flow, page) => (dispatch, getState) => {
    console.log(
        `${DEBUG_KEY}: [ showNextTutorialPage ]: flow: ${flow}, page: ${page}`
    )
    // track(E.TUTORIAL_PAGE_VIEWED)
    const tutorials = getState().tutorials
    const pageInfo = _.get(tutorials, `${flow}.${page}`)

    const { nextPage, nextStepNumber } = pageInfo
    if (typeof nextPage === 'object') {
        if (
            _.has(nextPage, nextStepNumber) &&
            _.get(nextPage, nextStepNumber) !== undefined
        ) {
            const { pageName, step } = _.get(nextPage, nextStepNumber)
            updateNextStepNumber(flow, pageName, step)(dispatch, getState)
        }
    }

    dispatch({
        type: TUTORIAL_NEXT_TUTORIAL_PAGE,
        payload: {
            flow,
            page,
        },
    })
}

/**
 * Load from aysnc storage of the tutorial state for user. Should be called when user login
 * @param {} userId
 */
export const loadTutorialState = (userId) => async (dispatch, getState) => {
    const tutorialStateKey = `${TUTORIAL_STATE_KEY}_${userId}`

    // const tutorialState = await SecureStore.getItemAsync(tutorialStateKey, {})
    const tutorialState = await AsyncStorage.getItem(tutorialStateKey)

    // Deserialize the json serialized object
    let parsedTutorialState
    if (tutorialState !== null) {
        parsedTutorialState = JSON.parse(tutorialState)
    }
    Logger.log(
        `${DEBUG_KEY}: [loadTutorialState] pased json with res:`,
        parsedTutorialState ? parsedTutorialState.length : 0,
        1
    )

    if (!parsedTutorialState || _.isEmpty(parsedTutorialState)) {
        Logger.log(
            `${DEBUG_KEY}: [loadTutorialState] abort as empty:`,
            parsedTutorialState,
            1
        )
        return
    }

    dispatch({
        type: TUTORIAL_LOAD_TUTORIAL_STATE,
        payload: {
            data: parsedTutorialState,
        },
    })
    return
}

/**
 * Save tutorial state to aysnc storage. Should be called on user logout
 */
export const saveTutorialState = () => async (dispatch, getState) => {
    const { userId } = getState().user
    let tutorialStateToSave = _.cloneDeep(getState().tutorials)

    // Right now, we manually reset all the showTutorial to false
    tutorialStateToSave = _.set(
        tutorialStateToSave,
        'create_goal.home.showTutorial',
        false
    )
    tutorialStateToSave = _.set(
        tutorialStateToSave,
        'create_goal.create_goal_modal.showTutorial',
        false
    )
    tutorialStateToSave = _.set(
        tutorialStateToSave,
        'meet_tab_friend.meet_tab.showTutorial',
        false
    )

    // Construct key
    const tutorialStateKey = `${TUTORIAL_STATE_KEY}_${userId}`
    Logger.log(
        `${DEBUG_KEY}: [saveTutorialState] tutorialStateToSave to store is:`,
        tutorialStateToSave,
        3
    )

    const dataToStore = JSON.stringify(tutorialStateToSave)
    Logger.log(
        `${DEBUG_KEY}: [saveTutorialState] data to store is:`,
        dataToStore,
        3
    )
    // const res = await SecureStore.setItemAsync(
    //     tutorialStateKey,
    //     dataToStore,
    //     {}
    // )
    const res = await AsyncStorage.setItem(tutorialStateKey, dataToStore)
    Logger.log(`${DEBUG_KEY}: [saveTutorialState] done with res: `, res, 1)
    return
}

export const resetTutorial = (flow, page) => async (dispatch, getState) => {
    dispatch({
        type: TUTORIAL_RESET_TUTORIAL,
        payload: {
            flow,
            page,
        },
    })
    await saveTutorialState()(dispatch, getState)
}

/**
 * Mark user as onboarded. In V1, this means when user finishes registration + create goal tutorial.
 * In V2, we have moved this to /redux/modules/registration/RegistrationActions.js.
 *
 * In V2, mark user as onboarded when user finishes all onboarding steps required without tutorial.
 * Since it's not related to tutorial anymore, we move this function to the new location. This is
 * to be cleaned up. Currently, it's used in home when copilot event reaches step 2 for tutorial.
 *
 * This is to be cleaned up during tutorial revamp.
 * TODO: cleanup
 */
export const markUserAsOnboarded = () => async (dispatch, getState) => {
    const { userId, token } = getState().user
    Logger.log(`${DEBUG_KEY}: [ markUserAsOnboarded ] for user: `, userId, 1)
    // track(E.TUTORIAL_DONE)
    // dispatch event to update both state.user and state.users
    dispatch({
        type: TUTORIAL_MARK_USER_ONBOARDED,
        payload: {
            userId,
        },
    })

    const onSuccess = (res) => {
        Logger.log(
            `${DEBUG_KEY}: [ markUserAsOnboarded ] success with res:`,
            res,
            1
        )
    }

    const onError = (err) => {
        console.warn(
            `${DEBUG_KEY}: [ markUserAsOnboarded ] failed with err`,
            err
        )
    }

    await TokenService.markUserAsOnboarded()

    // Fire request to update server user state
    API.put('secure/user/account/mark-as-onboarded', {}, token, 1)
        .then((res) => {
            if (res.status === 200) {
                onSuccess(res)
                return
            }
            onError(res)
        })
        .catch((err) => {
            onError(err)
        })
}

/**
 * Update current step number for a flow and a page. This is typically used when we need to put a checkpoint
 * on a tutorial. We can comeback and visit it.
 */
export const updateNextStepNumber = (flow, page, nextStepNumber) => (
    dispatch,
    getState
) => {
    dispatch({
        type: TUTORIAL_UPDATE_CURRENT_STEP_NUMBER,
        payload: {
            nextStepNumber,
            flow,
            page,
        },
    })
}

/**
 * Stop a tutorial to mark showTutorial for the page as false. Update the nextStepNumber
 */
export const pauseTutorial = (flow, page, nextStepNumber) => (
    dispatch,
    getState
) => {
    dispatch({
        type: TUTORIAL_PAUSE_TUTORIAL,
        payload: {
            flow,
            page,
            nextStepNumber,
        },
    })
}
