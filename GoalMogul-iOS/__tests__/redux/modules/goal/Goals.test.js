import _ from 'lodash';
import Goals from '../../../../src/redux/modules/goal/Goals';

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
    GOAL_DETAIL_SWITCH_TAB_V2
} from '../../../../src/reducers/GoalDetailReducers';
import { mockAGoal, DEFAULT_GOAL } from '../../../../__mocks__/mockGoals';

export const initialState = {
    goal: {},
    reference: [],
};

describe('Test page reference update', () => {
    let sharedGoalStore = _.cloneDeep(initialState);
    it('Same goal is opened twice', () => {
        const action = {
            type: GOAL_DETAIL_OPEN,
            payload: {
                goal: DEFAULT_GOAL,
                pageId: 1,
                goalId: _.get(DEFAULT_GOAL, "_id")
            }
        };
        const secondAction = {
            type: GOAL_DETAIL_OPEN,
            payload: {
                goal: DEFAULT_GOAL,
                pageId: 2,
                goalId: _.get(DEFAULT_GOAL, "_id")
            }
        };

        sharedGoalStore = Goals(sharedGoalStore, action);
        expect(sharedGoalStore).toMatchSnapshot();

        sharedGoalStore = Goals(sharedGoalStore, secondAction);
        expect(sharedGoalStore).toMatchSnapshot();
    });

    it('A goal page is closed', () => {
        const closeGoalAction = {
            type: GOAL_DETAIL_CLOSE,
            payload: {
                pageId: 1,
                goalId: _.get(DEFAULT_GOAL, "_id")
            }
        };
        sharedGoalStore = Goals(sharedGoalStore, closeGoalAction);
        expect(sharedGoalStore).toMatchSnapshot();
    });
});

describe('Test specific goal update', () => {

});
