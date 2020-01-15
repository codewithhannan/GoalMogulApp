/**
 * Utils for Comment related functions
 */
import _ from 'lodash';
import { INITIAL_COMMENT_OBJECT, INITIAL_COMMENT_PAGE } from "../../../../src/redux/modules/feed/comment/Comments";
import { DEFAULT_GOAL } from "../../MockGoals";
import { DEFAULT_GOAL_PAGE_ID } from '../../goal/Goals';

const goalId = _.get(DEFAULT_GOAL, "_id");
export const DEFAULT_TEST_COMMENTS_INITIAL_STATE = {
    [goalId]: {
        ...INITIAL_COMMENT_OBJECT,
        [DEFAULT_GOAL_PAGE_ID]: {
            ...INITIAL_COMMENT_PAGE
        }
    }
};
