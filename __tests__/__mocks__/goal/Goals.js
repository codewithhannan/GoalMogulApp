/**
 * Utils for Users related functions
 *
 * @format
 */

import _ from 'lodash'
import { INITIAL_GOAL_PAGE } from '../../../src/redux/modules/goal/Goals'
import { DEFAULT_GOAL } from '../MockGoals'

export const DEFAULT_GOAL_PAGE_ID = 'test_default_goal_page_id'
const goalId = _.get(DEFAULT_GOAL, '_id')
export const DEFAULT_TEST_GOALS_INITIAL_STATE = {
    [goalId]: {
        goal: _.cloneDeep(DEFAULT_GOAL),
        reference: [DEFAULT_GOAL_PAGE_ID],
        [DEFAULT_GOAL_PAGE_ID]: _.cloneDeep(INITIAL_GOAL_PAGE),
    },
}
