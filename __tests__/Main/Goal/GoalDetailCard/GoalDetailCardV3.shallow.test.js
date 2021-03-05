/** @format */

import React from 'react'
import _ from 'lodash'
import { mount, shallow } from 'enzyme'
import { GoalDetailCardV3 } from '../../../../src/Main/Goal/GoalDetailCard/GoalDetailCardV3'
import { DEFAULT_GOAL } from '../../../__mocks__/MockGoals'
import { INITIAL_NAVIGATION_STATE_V2 } from '../../../../src/redux/modules/goal/Goals'
import { MAIN_NAVIGATION_ROUTES } from '../../../../src/reducers/NavigationReducers'

/**
 * This is a component test for GoalDetailCardV3. It shallow renders the page with
 * required props and expect the function to be called and state to be changed.
 *
 * The tests will manually update the props and pass into the component to verify
 * the necessary change.
 *
 * There are two parts of the tests.
 * First part is to very mapStateToProps which makes sure that redux states are
 * properly translated to props which are used by the component.
 *
 * Second part has three steps for each test
 * 1. specific props renders component with a specific state
 * 2. specific actions in component that call certain functions.
 * 3. after specific functions are triggered, we manually update the props to re-render the component
 *    and verify the component rendering
 */

describe('goal detail v3', () => {
    let component
    it('should shallow render basic goal detail v3 page', () => {
        component = shallow(<GoalDetailCardV3 {...DEFAULT_GOALDETAIL_PROPS} />)
        expect(component.debug()).toMatchSnapshot()
        expect(component.find('Spinner').exists()).toBeTruthy()
    })
})

const DEFAULT_GOALDETAIL_FUNCTIONS = {
    closeGoalDetail: jest.fn(),
    closeGoalDetailWithoutPoping: jest.fn(),
    attachSuggestion: jest.fn(),
    cancelSuggestion: jest.fn(),
    openSuggestionModal: jest.fn(),
    goalDetailSwitchTabV2: jest.fn(),
    goalDetailSwitchTabV2ByKey: jest.fn(),
    removeSuggestion: jest.fn(),
    createCommentFromSuggestion: jest.fn(),
    resetCommentType: jest.fn(),
    updateNewComment: jest.fn(),
    createCommentForSuggestion: jest.fn(),
    createSuggestion: jest.fn(),
    editGoal: jest.fn(),
    markGoalAsComplete: jest.fn(),
    refreshGoalDetailById: jest.fn(),
    refreshComments: jest.fn(),
    markUserViewGoal: jest.fn(),
    // Tutorial related
    showNextTutorialPage: jest.fn(),
    startTutorial: jest.fn(),
    updateNextStepNumber: jest.fn(),
    pauseTutorial: jest.fn(),
    saveTutorialState: jest.fn(),
}

const DEFAULT_GOALDETAIL_DATA = {
    commentLoading: false,
    stepsAndNeeds: [],
    comments: [],
    originalComments: [], // All comments in raw form
    goalDetail: DEFAULT_GOAL,
    navigationState: _.cloneDeep(INITIAL_NAVIGATION_STATE_V2),
    showingModalInDetail: false, // Can be potentially cleaned up
    showSuggestionModal: false,
    isSelf: true,
    tab: MAIN_NAVIGATION_ROUTES[0], // Default set to homeTab
    // When on focusTab, show the count for focusedItem
    focusedItemCount: 0,
    updating: false,
    newComment: undefined,
    // Tutorial related
    tutorialText: '',
    hasShown: true,
    showTutorial: false,
    copilotEvents: {
        on: jest.fn(),
        off: jest.fn(),
    },
}

const DEFAULT_GOALDETAIL_PROPS = {
    ...DEFAULT_GOALDETAIL_FUNCTIONS,
    ...DEFAULT_GOALDETAIL_DATA,
}
