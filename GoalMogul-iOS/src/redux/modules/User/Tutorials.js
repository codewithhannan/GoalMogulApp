/**
 * This is the reducer for user step by step tutorial.
 * NOTE: right now we can't resume a step. Step order starts from 0 and totalStep is the length
 *
 * @format
 */

import _ from 'lodash'

/**
 * This defines the initial tutorial for an user. Each upper key defines a flow
 */

export const INITIAL_TUTORIAL = {
    create_goal: {
        home: {
            nextPage: {
                // Map between current step and nextPage
                1: {
                    pageName: 'create_goal_modal',
                    step: 0,
                },
                2: undefined,
            },
            showTutorial: false,
            hasShown: false,
            totalStep: 2, // Used for onStepChange and check if this is the last step to fire showNextTutorialPage action
            tutorialText: [
                'Tap here to add a goal',
                'You can run the tutorial again by selecting it from the menu in the upper right corner.',
            ],
            nextStepNumber: 0, // This is a zero indexed variable. Since if tutorial has not started, next step number is zero.
        },
        create_goal_modal: {
            nextPage: {
                9: {
                    pageName: 'home',
                    // This is the next step number for the tutorial we are going to show.
                    // For example, if we are going to show step 1, then its next step number should be 2
                    step: 2,
                },
            },
            showTutorial: false,
            hasShown: false,
            totalStep: 9, // Used for onStepChange and check if this is the last step
            tutorialText: [
                "Tap here to toggle who's allowed to see your goals",
                'Enter your goal here (i.e. lose 10 lbs, earn $1m dollars, etc.)',
                '(optional) Pick a Category for your goal',
                '(optional) Pick a number 1-10 to note the importance of your goal',
                '(optional) Pick a Start and End date to keep track of progress',
                '(optional) List some steps to achieving your goal',
                '(optional) Type in your needs so others know how they can help you',
                'Too busy to think about what goals to add? Try picking some from this list!',
                "Tap Create whenever you're ready to post your goal!",
            ],
            nextStepNumber: 0,
        },
        hasShown: false,
    },
    meet_tab_friend: {
        meet_tab: {
            nextPage: undefined, // This is the last page for this flow
            showTutorial: false,
            hasShown: false,
            totalStep: 2, // Used for onStepChange and check if this is the last step,
            tutorialText: [
                'Discover interesting people that can help you achieve your goals!',
                'This app is MUCH better with friends. Invite them to GoaMogul today!',
            ],
            nextStepNumber: 0,
        },
        hasShown: false,
    },
    goal_detail: {
        // First timer on goal detail
        goal_detail_page: {
            nextPage: undefined, // This is the last page for this flow
            showTutorial: false,
            hasShown: false,
            totalStep: 5, // Used for onStepChange and check if this is the last step,
            tutorialText: [
                'Tap here to set a Reminder for this Goal',
                "Tap here to share your Goal to the top of your friends' Goal feed",
                'Tap here to mark this Goal as complete',
                'Tap here to edit your Goal',
                'Tap here to delete your Goal',
            ],
            nextStepNumber: 0,
        },
        hasShown: false,
    },
    chat_tab_flow: {
        chat_tab: {
            nextPage: undefined,
            showTutorial: false,
            hasShown: false,
            totalStep: 2, // Used for onStepChange and check if this is the last step,
            tutorialText: [
                'Tap here to start a conversation',
                'GoalMogul Bot can help you think about new goals. Tap here to learn more.',
            ],
            nextStepNumber: 0,
        },
    },
    isOnBoarded: false,
    lastFlow: undefined,
    lastPage: undefined,
    isOnCurrentFlowLastStep: false,
}

// Mark a reducer[flow][page][showTutorial] = true to start
export const TUTORIAL_START_TUTORIAL = 'tutorial_start_tutorial'

// 1. Mark current reducer[flow][page][hasShown] = true, and showTutorial = false
// 2. Mark next [flow][page][nextPage] = true, if nextPage is undefined, just log last page of flow
export const TUTORIAL_NEXT_TUTORIAL_PAGE = 'tutorial_next_tutorial_page'

// Load the serialized json string from async storage and update the tutorial on user login
export const TUTORIAL_LOAD_TUTORIAL_STATE = 'tutorial_load_tutorial_state'

// Mark user as onBoarded
export const TUTORIAL_MARK_USER_ONBOARDED = 'tutorial_mark_user_onboard'

export const TUTORIAL_STATE_KEY = 'tutorial_state'

// Update current step number. This is currently used by home tutorial flow to mark the current step of a page
export const TUTORIAL_UPDATE_CURRENT_STEP_NUMBER =
    'tutorial_update_current_step_number'

// Stop a tutorial. Mark showTutorial to false and update the nextStepNumber
export const TUTORIAL_PAUSE_TUTORIAL = 'tutorial_pause_tutorial'

export const TUTORIAL_RESET_TUTORIAL = 'tutorial_reset_tutorial'

const DEBUG_KEY = '[ Reducer Tutorials ]'
export default (state = INITIAL_TUTORIAL, action) => {
    switch (action.type) {
        case TUTORIAL_START_TUTORIAL: {
            let newState = _.cloneDeep(state)
            const { flow, page } = action.payload
            if (!_.has(newState, `${flow}.${page}`)) {
                console.warn(
                    `${DEBUG_KEY}: [ ${action.type} ]: flow: ${flow} and page: ${page} not found`
                )
                return newState
            }

            newState = _.set(newState, 'isOnCurrentFlowLastStep', false)
            newState = _.set(newState, `${flow}.${page}.showTutorial`, true)
            newState = _.set(newState, `${flow}.${page}.nextStepNumber`, 0)
            return newState
        }

        case TUTORIAL_NEXT_TUTORIAL_PAGE: {
            let newState = _.cloneDeep(state)
            const { flow, page } = action.payload
            if (!_.has(newState, `${flow}.${page}`)) {
                console.warn(
                    `${DEBUG_KEY}: [ ${action.type} ]: current flow: ${flow} and page: ${page} not found`
                )
                return newState
            }

            // Update the state of the current page in the flow
            newState = _.set(newState, `${flow}.${page}.showTutorial`, false)
            newState = _.set(newState, `${flow}.${page}.hasShown`, true)

            // Find the nextPage from the current page
            const nextPage = _.get(newState, `${flow}.${page}.nextPage`)
            if (!nextPage) {
                // Reset tutorial state since this is last page
                console.log(
                    `${DEBUG_KEY}: [ ${action.type} ]: last page for flow: ${flow} and page: ${page}`
                )
                newState = _.set(newState, `${flow}.${page}.nextStepNumber`, 0)
                newState = _.set(
                    newState,
                    `${flow}.${page}.showTutorial`,
                    false
                )
                console.log(`${DEBUG_KEY}: new state is: `, newState)
                return newState
            }

            // Get current page's next step number. This is used to determine next page's name and step
            const currentPageNextStepNumber = _.get(
                newState,
                `${flow}.${page}.nextStepNumber`
            )

            let nextPageString = nextPage
            let nextPageNextStepNumber
            if (typeof nextPage === 'object') {
                if (!_.has(nextPage, currentPageNextStepNumber)) {
                    // It means we have some misconfiguration.
                    console.warn(
                        `${DEBUG_KEY}: [ ${action.type} ]: invalid next page. NextPage: ${nextPage}, nextStepNumber: ${currentPageNextStepNumber}`
                    )
                    return newState
                }

                if (_.get(nextPage, currentPageNextStepNumber) !== undefined) {
                    // Use the current page's current step to find the next page
                    let { pageName, step } = _.get(
                        nextPage,
                        currentPageNextStepNumber
                    )
                    // Set next page string to the real one.
                    nextPageString = pageName
                    // Ste next page next step number
                    nextPageNextStepNumber = step
                } else {
                    // Reset tutorial state since this is last page
                    console.log(
                        `${DEBUG_KEY}: [ ${action.type} ]: last page for flow: ${flow} and page: ${page}`
                    )
                    newState = _.set(
                        newState,
                        `${flow}.${page}.nextStepNumber`,
                        0
                    )
                    newState = _.set(
                        newState,
                        `${flow}.${page}.showTutorial`,
                        false
                    )
                    console.log(`${DEBUG_KEY}: new state is: `, newState)
                    return newState
                }
            }

            if (!_.has(newState, `${flow}.${nextPageString}`)) {
                console.warn(
                    `${DEBUG_KEY}: [ ${action.type} ]: invalid next page: ${nextPageString} from flow: ${flow} and page: ${page}`
                )
                return newState
            }

            // Update the state of the nextPage to start the tutorial
            newState = _.set(
                newState,
                `${flow}.${nextPageString}.showTutorial`,
                true
            )

            if (nextPageNextStepNumber) {
                newState = _.set(
                    newState,
                    `${flow}.${nextPageString}.nextStepNumber`,
                    nextPageNextStepNumber
                )
            }
            return newState
        }

        // Load the serialized json string from async storage and update the tutorial on user login
        case TUTORIAL_LOAD_TUTORIAL_STATE: {
            const { data } = action.payload
            let newState = _.cloneDeep(state)

            // NOTE: here we merge saved state into default state, customizer will keep the array
            // in the default state than merging or concat
            // console.log(`${DEBUG_KEY}: loaded tutorial state: `, data);
            // console.log(`${DEBUG_KEY}: original state: `, newState);
            const updatedState = _.mergeWith(newState, data, customizer)

            return _.cloneDeep(updatedState)
        }

        case TUTORIAL_UPDATE_CURRENT_STEP_NUMBER: {
            const { nextStepNumber, flow, page } = action.payload
            let newState = _.cloneDeep(state)

            if (!_.has(newState, `${flow}.${page}`)) {
                console.warn(
                    `${DEBUG_KEY}: [ ${action.type} ]: invalid flow: ${flow}, ${page}`
                )
                return newState
            }

            // Check if current step is the last step
            const currentPage = _.get(newState, `${flow}.${page}`)
            const { totalStep, nextPage } = currentPage

            console.log(
                `${DEBUG_KEY}: totalStep: ${totalStep}, nextStepNumber: ${nextStepNumber}`
            )
            if (nextStepNumber >= totalStep) {
                // If nextStepNumber === total step and nextPage === undefined, this is last page
                if (nextPage === undefined) {
                    newState = _.set(newState, 'isOnCurrentFlowLastStep', true)
                    console.log(
                        `${DEBUG_KEY}: [isOnCurrentFlowLastStep]: totalStep: ${totalStep}, nextStepNumber: ${nextStepNumber}, set isOnCurrentFlowLastStep to true`
                    )
                }

                if (
                    typeof nextPage === 'object' &&
                    _.has(nextPage, totalStep) &&
                    _.get(nextPage, totalStep) === undefined
                ) {
                    newState = _.set(newState, 'isOnCurrentFlowLastStep', true)
                    console.log(
                        `${DEBUG_KEY}: totalStep: ${totalStep}, nextStepNumber: ${nextStepNumber}, set isOnCurrentFlowLastStep to true`
                    )
                }
            }

            newState = _.set(
                newState,
                `${flow}.${page}.nextStepNumber`,
                nextStepNumber
            )
            return newState
        }

        case TUTORIAL_PAUSE_TUTORIAL: {
            const { flow, page, nextStepNumber } = action.payload
            let newState = _.cloneDeep(state)

            if (!_.has(newState, `${flow}.${page}`)) {
                console.warn(
                    `${DEBUG_KEY}: [ ${action.type} ]: invalid flow: ${flow}, ${page}`
                )
                return newState
            }

            newState = _.set(
                newState,
                `${flow}.${page}.nextStepNumber`,
                nextStepNumber
            )
            newState = _.set(newState, `${flow}.${page}.showTutorial`, false)
            return newState
        }

        case TUTORIAL_MARK_USER_ONBOARDED: {
            let newState = _.cloneDeep(state)
            newState = _.set(newState, 'isOnBoarded', true)
            return newState
        }

        case TUTORIAL_RESET_TUTORIAL: {
            let newState = _.cloneDeep(state)
            const { flow, page } = action.payload

            const originalFlow = _.get(newState, `${flow}`)
            const defaultFlow = _.cloneDeep(_.get(INITIAL_TUTORIAL, flow))

            // Preserve hasShown
            const mergedFlow = _.mergeWith(
                defaultFlow,
                originalFlow,
                preserveHasShown
            )

            // console.log(`${DEBUG_KEY}: defaultFlow flow before merge is : `, defaultFlow);
            // console.log(`${DEBUG_KEY}: original flow is : `, originalFlow);
            // console.log(`${DEBUG_KEY}: mergedFlow flow is : `, mergedFlow);

            newState = _.set(newState, `${flow}`, mergedFlow)
            return newState
        }

        default:
            return { ...state }
    }
}

/**
 * Preserve hasShown in the curren reducer
 * @param {*} objValue value from INITIAL_STATE
 * @param {*} srcValue value in the current reducer
 * @param {*} key
 */
function preserveHasShown(objValue, srcValue, key) {
    if (key === 'hasShown') {
        return srcValue
    }
    // return objValue;
}

// This customizer preserves objValue's array values
function customizer(objValue, srcValue, key) {
    if (key === 'hasShown') {
        return srcValue
    }

    if (Array.isArray(objValue)) {
        return objValue
    }
}
