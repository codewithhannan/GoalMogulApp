/**
 * This is the object selector for user object in explore
 *
 * @format
 */

import { createSelector } from 'reselect'
import _ from 'lodash'

const DEBUG_KEY = '[ Selector Explore ]'

const getUsers = (state) => state.users
const getUserIds = (state) => state.explore.people.data

export const makeGetUsers = () => {
    return createSelector([getUserIds, getUsers], (userIds, users) => {
        const ret = userIds
            .map((id) => {
                if (!_.has(users, id)) {
                    // User not found. Return empty and got filtered
                    return {}
                }
                return _.get(users, `${id}.user`)
            })
            .filter((u) => !_.isEmpty(u))
        return ret
    })
}
