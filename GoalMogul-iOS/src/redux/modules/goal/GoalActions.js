/**
 * This file is created to consolidate all goal related group fetch actions.
 *
 * @format
 */

import { queryBuilder } from '../../middleware/utils'
import { api as API } from '../../middleware/api'

export const loadUserGoals = (
    skip,
    limit,
    filter,
    token,
    onSuccess,
    onError
) => {
    // Todo: base route depends on tab selection
    const route = `secure/goal/user?${queryBuilder(skip, limit, filter)}`
    API.get(route, token)
        .then((res) => {
            // console.log(`${DEBUG_KEY}: res for fetching for tab: ${tab}, is: `, res);
            if (res.status === 200 || (res && res.data)) {
                // TODO: change this
                return onSuccess(res.data)
            }
            onError(res)
        })
        .catch((err) => {
            onError(err)
        })
}
