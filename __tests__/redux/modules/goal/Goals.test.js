/** @format */

import _ from 'lodash'
import Goals from '../../../../src/redux/modules/goal/Goals'

import {
    GOAL_DETAIL_OPEN,
    GOAL_DETAIL_FETCH,
    GOAL_DETAIL_FETCH_DONE,
    GOAL_DETAIL_FETCH_ERROR,
    GOAL_DETAIL_UPDATE,
    GOAL_DETAIL_UPDATE_DONE,
    GOAL_DETAIL_CLOSE,
    GOAL_DETAIL_MARK_NEED_AS_COMPLETE_SUCCESS,
    GOAL_DETAIL_MARK_STEP_AS_COMPLETE_SUCCESS,
    GOAL_DETAIL_SHARE_TO_MASTERMIND_SUCCESS,
    GOAL_DETAIL_MARK_AS_COMPLETE_SUCCESS,
    GOAL_DETAIL_SWITCH_TAB_V2,
} from '../../../../src/reducers/GoalDetailReducers'
import {
    LIKE_GOAL,
    UNLIKE_GOAL,
} from '../../../../src/redux/modules/like/LikeReducers'
import {
    HOME_REFRESH_GOAL_DONE,
    HOME_LOAD_GOAL_DONE,
} from '../../../../src/reducers/Home'
import {
    PROFILE_FETCH_TAB_DONE,
    PROFILE_REFRESH_TAB_DONE,
    PROFILE_GOAL_DELETE_SUCCESS,
} from '../../../../src/reducers/Profile'
import { DEFAULT_GOAL } from '../../../__mocks__/mockGoals'

// TODO: types missing tests are:
// [
//   HOME_REFRESH_GOAL_DONE, HOME_LOAD_GOAL_DONE, PROFILE_FETCH_TAB_DONE, PROFILE_REFRESH_TAB_DONE,
//   PROFILE_GOAL_DELETE_SUCCESS
// ]

export const initialState = {
    goal: {},
    reference: [],
}

// Verify goal page opening and reference update
describe('Test page reference update', () => {
    let sharedGoalStore = _.cloneDeep(initialState)
    it('Test goal is opened twice', () => {
        const action = {
            type: GOAL_DETAIL_OPEN,
            payload: {
                goal: DEFAULT_GOAL,
                pageId: 1,
                goalId: _.get(DEFAULT_GOAL, '_id'),
            },
        }
        const secondAction = {
            type: GOAL_DETAIL_OPEN,
            payload: {
                goal: DEFAULT_GOAL,
                pageId: 2,
                goalId: _.get(DEFAULT_GOAL, '_id'),
            },
        }

        sharedGoalStore = Goals(sharedGoalStore, action)
        expect(sharedGoalStore).toMatchSnapshot()

        sharedGoalStore = Goals(sharedGoalStore, secondAction)
        expect(sharedGoalStore).toMatchSnapshot()
    })

    it('Test a goal page is closed', () => {
        const closeGoalAction = {
            type: GOAL_DETAIL_CLOSE,
            payload: {
                pageId: 1,
                goalId: _.get(DEFAULT_GOAL, '_id'),
            },
        }
        sharedGoalStore = Goals(sharedGoalStore, closeGoalAction)
        expect(sharedGoalStore).toMatchSnapshot()
    })
})

// Test specific goal loading and loading error
describe('Test specific goal update', () => {
    // Setup goal store with a single goal
    let sharedGoalStore = _.cloneDeep(initialState)
    const pageId = 1
    const action = {
        type: GOAL_DETAIL_OPEN,
        payload: {
            goal: DEFAULT_GOAL,
            pageId,
            goalId: _.get(DEFAULT_GOAL, '_id'),
        },
    }
    sharedGoalStore = Goals(sharedGoalStore, action)

    it('Test goal loading state change', () => {
        const action = {
            type: GOAL_DETAIL_FETCH,
            payload: { goalId: _.get(DEFAULT_GOAL, '_id'), pageId },
        }
        sharedGoalStore = Goals(sharedGoalStore, action)
        expect(sharedGoalStore).toMatchSnapshot()
    })

    it('Test goal loading error state change', () => {
        const action = {
            type: GOAL_DETAIL_FETCH_ERROR,
            payload: { goalId: _.get(DEFAULT_GOAL, '_id'), pageId },
        }

        sharedGoalStore = Goals(sharedGoalStore, action)
        expect(sharedGoalStore).toMatchSnapshot()
    })

    it('Test goal loading success for an unopened page', () => {
        const action = {
            type: GOAL_DETAIL_FETCH_DONE,
            payload: { goalId: _.get(DEFAULT_GOAL, '_id'), pageId: 0 },
        }

        sharedGoalStore = Goals(sharedGoalStore, action)
        expect(sharedGoalStore).toMatchSnapshot()
    })

    it('Test goal loading success for a new page', () => {
        const action = {
            type: GOAL_DETAIL_FETCH_DONE,
            payload: { goalId: _.get(DEFAULT_GOAL, '_id'), pageId: 2 },
        }

        sharedGoalStore = Goals(sharedGoalStore, action)
        expect(sharedGoalStore).toMatchSnapshot()
    })

    it('Test goal loading success for an opened page with updated goal', () => {
        const action = {
            type: GOAL_DETAIL_FETCH_DONE,
            payload: {
                goalId: _.get(DEFAULT_GOAL, '_id'),
                pageId,
                goal: _.set(DEFAULT_GOAL, 'General', 'test'),
            },
        }

        sharedGoalStore = Goals(sharedGoalStore, action)
        expect(sharedGoalStore).toMatchSnapshot()
    })

    it('Test goal update state change', () => {
        const action = {
            type: GOAL_DETAIL_UPDATE,
            payload: { goalId: _.get(DEFAULT_GOAL, '_id'), pageId },
        }

        sharedGoalStore = Goals(sharedGoalStore, action)
        expect(sharedGoalStore).toMatchSnapshot()
    })

    it('Test goal update on an unopened page state change', () => {
        const action = {
            type: GOAL_DETAIL_UPDATE,
            // Current opened pageId is 1, this would show warning message
            payload: { goalId: _.get(DEFAULT_GOAL, '_id'), pageId: 2 },
        }

        sharedGoalStore = Goals(sharedGoalStore, action)
        expect(sharedGoalStore).toMatchSnapshot()
    })

    it('Test goal update on done state change', () => {
        const action = {
            type: GOAL_DETAIL_UPDATE_DONE,
            // Current opened pageId is 1
            payload: { goalId: _.get(DEFAULT_GOAL, '_id'), pageId },
        }

        sharedGoalStore = Goals(sharedGoalStore, action)
        expect(sharedGoalStore).toMatchSnapshot()
    })

    it('Test goal share to goal feed success', () => {
        const action = {
            type: GOAL_DETAIL_SHARE_TO_MASTERMIND_SUCCESS,
            payload: { goalId: _.get(DEFAULT_GOAL, '_id') },
        }
        sharedGoalStore = Goals(sharedGoalStore, action)
        expect(sharedGoalStore).toMatchSnapshot()
    })

    it('Test goal mark as complete', () => {
        const action = {
            type: GOAL_DETAIL_MARK_AS_COMPLETE_SUCCESS,
            payload: {
                goalId: _.get(DEFAULT_GOAL, '_id'),
                data: { isCompleted: true },
            },
        }
        sharedGoalStore = Goals(sharedGoalStore, action)
        expect(sharedGoalStore).toMatchSnapshot()
    })

    it('Test goal mark a need as complete', () => {
        const action = {
            type: GOAL_DETAIL_MARK_NEED_AS_COMPLETE_SUCCESS,
            payload: {
                goalId: _.get(DEFAULT_GOAL, '_id'),
                pageId,
                id: _.get(DEFAULT_GOAL, 'needs[0]._id'),
                isCompleted: true,
            },
        }
        sharedGoalStore = Goals(sharedGoalStore, action)
        expect(sharedGoalStore).toMatchSnapshot()
    })

    it('Test goal mark a need as incomplete', () => {
        const action = {
            type: GOAL_DETAIL_MARK_NEED_AS_COMPLETE_SUCCESS,
            payload: {
                goalId: _.get(DEFAULT_GOAL, '_id'),
                pageId,
                id: _.get(DEFAULT_GOAL, 'needs[0]._id'),
                isCompleted: false,
            },
        }
        sharedGoalStore = Goals(sharedGoalStore, action)
        expect(sharedGoalStore).toMatchSnapshot()
    })

    it('Test goal mark a step as complete', () => {
        const action = {
            type: GOAL_DETAIL_MARK_STEP_AS_COMPLETE_SUCCESS,
            payload: {
                goalId: _.get(DEFAULT_GOAL, '_id'),
                pageId,
                id: _.get(DEFAULT_GOAL, 'steps[0]._id'),
                isCompleted: false,
            },
        }
        sharedGoalStore = Goals(sharedGoalStore, action)
        expect(sharedGoalStore).toMatchSnapshot()
    })

    it('Test goal mark a step as incomplete', () => {
        const action = {
            type: GOAL_DETAIL_MARK_STEP_AS_COMPLETE_SUCCESS,
            payload: {
                goalId: _.get(DEFAULT_GOAL, '_id'),
                pageId,
                id: _.get(DEFAULT_GOAL, 'steps[0]._id'),
                isCompleted: false,
            },
        }
        sharedGoalStore = Goals(sharedGoalStore, action)
        expect(sharedGoalStore).toMatchSnapshot()
    })

    it('Test goal like', () => {
        const action = {
            type: LIKE_GOAL,
            payload: {
                id: _.get(DEFAULT_GOAL, '_id'),
                likeId: 'like',
                undo: false,
            },
        }
        sharedGoalStore = Goals(sharedGoalStore, action)
        expect(sharedGoalStore).toMatchSnapshot()
    })

    it('Test goal like undo', () => {
        const action = {
            type: LIKE_GOAL,
            payload: {
                id: _.get(DEFAULT_GOAL, '_id'),
                likeId: 'undefined',
                undo: true,
            },
        }
        sharedGoalStore = Goals(sharedGoalStore, action)
        expect(sharedGoalStore).toMatchSnapshot()
    })

    it('Test goal unlike', () => {
        const action = {
            type: UNLIKE_GOAL,
            payload: {
                id: _.get(DEFAULT_GOAL, '_id'),
                likeId: 'undefined',
                undo: false,
            },
        }
        sharedGoalStore = Goals(sharedGoalStore, action)
        expect(sharedGoalStore).toMatchSnapshot()
    })

    it('Test goal unlike undo', () => {
        const action = {
            type: UNLIKE_GOAL,
            payload: {
                id: _.get(DEFAULT_GOAL, '_id'),
                likeId: 'like',
                undo: true,
            },
        }
        sharedGoalStore = Goals(sharedGoalStore, action)
        expect(sharedGoalStore).toMatchSnapshot()
    })
})
