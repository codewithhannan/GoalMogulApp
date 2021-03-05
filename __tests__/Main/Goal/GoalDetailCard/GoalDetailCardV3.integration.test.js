/**
 * This is for full integration test on GoalDetailCardV3.
 * Required app state is setup and it's using deep rendering.
 * It simulates the user interaction with the App including press, swipe, scroll and input.
 * Following are just initial setup code which are not functioning right now. Need
 * further investigation for full setup.
 *
 * @format
 */

import React from 'react'
import { Animated } from 'react-native'
import { fireEvent } from 'react-native-testing-library'
import _ from 'lodash'
import GoalDetailCardV3Wrapper, {
    GoalDetailCardV3,
} from '../../../../src/Main/Goal/GoalDetailCard/GoalDetailCardV3'
import { DEFAULT_GOAL } from '../../../__mocks__/MockGoals'
import { INITIAL_NAVIGATION_STATE_V2 } from '../../../../src/redux/modules/goal/Goals'
import { MAIN_NAVIGATION_ROUTES } from '../../../../src/reducers/NavigationReducers'
import {
    createStoreWithReducers,
    componentWrapperWithStore,
} from '../../../__mocks__/ReduxMockStore'
import { DEFAULT_TEST_USER_INTIAL_STATE } from '../../../__mocks__/user/Users'
import {
    DEFAULT_TEST_GOALS_INITIAL_STATE,
    DEFAULT_GOAL_PAGE_ID,
} from '../../../__mocks__/goal/Goals'
import {
    DEFAULT_TEST_COMMENTS_INITIAL_STATE,
    DEFAULT_TEST_COMMENTREDUCERS_INITIAL_STATE,
} from '../../../__mocks__/feed/comment/Comments'
import { DEFAULT_TEST_NAVIGATION_INITIAL_STATE } from '../../../__mocks__/navigation/Navigations'
import * as likeActions from '../../../../src/redux/modules/like/LikeActions'
import { customRenderer } from '../../../__mocks__/Utils'

// NOTE: somehow there is a bug in react-native-reanimated. We need to mock its
// Animated.View since it's used by react-native-tab-view
jest.mock('react-native-reanimated', () => {
    const originalModule = jest.requireActual('react-native-reanimated')
    const reactNative = jest.requireActual('react-native')
    return {
        ...originalModule,
        View: reactNative.Animated.View,
    }
})

jest.mock('react-native-modal-datetime-picker')
// Example to mock an import
// jest.mock("../../../../src/redux/modules/like/LikeActions", () => {
//     const originalModule = jest.requireActual("../../../../src/redux/modules/like/LikeActions");

//     return {
//         ...originalModule,
//         unlikeGoal: jest.fn().mockImplementation(() => () => {}),
//         likeGoal: jest.fn().mockImplementation(() => () => {})
//     }
// });

// initial state for goal detail page integration test and deep rendering
const INITIAL_STATE = {
    user: { ...DEFAULT_TEST_USER_INTIAL_STATE },
    goals: { ...DEFAULT_TEST_GOALS_INITIAL_STATE },
    comments: { ...DEFAULT_TEST_COMMENTS_INITIAL_STATE },
    comment: { ...DEFAULT_TEST_COMMENTREDUCERS_INITIAL_STATE },
    navigation: { ...DEFAULT_TEST_NAVIGATION_INITIAL_STATE },
}

// NOTE: best practice is to for each test we only render and re-render once
describe('goal detail v3', () => {
    // let store;
    let store
    let wrapper
    let component
    let connectedComponent
    beforeEach(() => {
        // All states that the component required need to be setup
        store = createStoreWithReducers(INITIAL_STATE)
        wrapper = componentWrapperWithStore(store)
        fetch.mockResponseAlwaysSuccess(JSON.stringify({}))
        component = customRenderer(
            <GoalDetailCardV3 {...DEFAULT_GOALDETAIL_PROPS} />,
            { wrapper }
        )
    })

    afterEach(() => {
        if (component !== undefined && component !== null) {
            const { unmount } = component
            unmount()
        }

        if (connectedComponent !== undefined && connectedComponent !== null) {
            const { unmount } = connectedComponent
            unmount()
        }
    })

    // Snapshot test is currently disabled due to mocking issue
    // it("should deep render basic goal detail v3 page", () => {
    //     const { toJSON } = component;
    //     // Verify functions for componentDidMount() is called
    //     expect(DEFAULT_GOALDETAIL_FUNCTIONS.copilotEvents.on).toHaveBeenCalled();
    //     expect(DEFAULT_GOALDETAIL_FUNCTIONS.refreshComments).toHaveBeenCalled();
    //     expect(toJSON()).toMatchSnapshot();
    // });

    // NOTE: should notice some warning since the mock fetch is not
    // considering all the cases
    it('like integration test', async () => {
        connectedComponent = customRenderer(
            <GoalDetailCardV3Wrapper {...DEFAULT_CONNECTED_GOALDETAIL_PROPS} />,
            { wrapper }
        )
        const { getByTestId } = connectedComponent

        // Mock server like action response with likeId
        fetch.mockResponseSuccess(
            JSON.stringify({ data: { _id: 'testLikeId' } })
        )

        // Expect initial likeCount to be 1
        expect(
            getByTestId('button-open-like-list-like-count').props.children
        ).toEqual(1)
        fireEvent.press(getByTestId('like-button'))
        await new Promise((r) => setTimeout(r, 200))

        // Expect reducer change to increase the likeCount displayed
        expect(
            getByTestId('button-open-like-list-like-count').props.children
        ).toEqual(2)
    })

    it('view all commments integration test', async () => {
        connectedComponent = customRenderer(
            <GoalDetailCardV3Wrapper {...DEFAULT_CONNECTED_GOALDETAIL_PROPS} />,
            { wrapper }
        )
        const { getByTestId, queryByTestId } = connectedComponent
        // Verify FocusTab is not initially rendered
        expect(queryByTestId('goal-detail-card-focus-tab')).toBeNull()

        // Click on view all comments button
        fireEvent.press(getByTestId('button-view-all-comments'))
        await new Promise((r) => setTimeout(r, 500))

        // Verify No Comments are shown
        expect(queryByTestId('focus-tab-empty-result').props.text).toBe(
            'No Comments'
        )
    })

    it('like list integration test', async () => {
        const { getByTestId } = component
        fetch.mockResponseSuccess(JSON.stringify({}))
        expect(getByTestId('like-list-modal').props.isVisible).toBeFalsy()
        // Open like list by clicking the button
        fireEvent.press(getByTestId('button-open-like-list'))
        expect(getByTestId('like-list-modal').props.isVisible).toBeTruthy()
        // Close the list by clicking the button
        fireEvent.press(getByTestId('like-list-modal-close-button'))
        expect(getByTestId('like-list-modal').props.isVisible).toBeFalsy()
    })

    it('share list integration test', async () => {
        const { getByTestId } = component
        fetch.mockResponseSuccess(JSON.stringify({}))
        expect(getByTestId('share-list-modal').props.isVisible).toBeFalsy()
        // Open share list by clicking the button
        fireEvent.press(getByTestId('button-open-share-list'))
        expect(getByTestId('share-list-modal').props.isVisible).toBeTruthy()
        // Close share list by clicking the button
        fireEvent.press(getByTestId('share-list-modal-close-button'))
        expect(getByTestId('share-list-modal').props.isVisible).toBeFalsy()
    })

    // TODO: set focusType and focusRef to test renderComment() in the component
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
    copilotEvents: {
        on: jest.fn(),
        off: jest.fn(),
    },
}

const DEFAULT_GOALDETAIL_DATA = {
    commentLoading: false,
    stepsAndNeeds: [],
    comments: [],
    originalComments: [], // All comments in raw form
    goalDetail: DEFAULT_GOAL,
    pageId: DEFAULT_GOAL_PAGE_ID,
    goalId: _.get(DEFAULT_GOAL, '_id'),
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
}

const DEFAULT_GOALDETAIL_PROPS = {
    ...DEFAULT_GOALDETAIL_FUNCTIONS,
    ...DEFAULT_GOALDETAIL_DATA,
}

const DEFAULT_CONNECTED_GOALDETAIL_PROPS = {
    pageId: DEFAULT_GOAL_PAGE_ID,
    goalId: _.get(DEFAULT_GOAL, '_id'),
}
